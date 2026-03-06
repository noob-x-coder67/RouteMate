import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";

/**
 * HELPER: Formats raw route dates into a 7-day chart format
 */
const formatWeeklyData = (routes: { createdAt: Date }[]) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return { day: days[d.getDay()], count: 0, date: d.toDateString() };
  }).reverse();

  routes.forEach((route) => {
    const routeDay = new Date(route.createdAt).toDateString();
    const dayEntry = last7Days.find((d) => d.date === routeDay);
    if (dayEntry) dayEntry.count++;
  });

  return last7Days.map(({ day, count }) => ({ day, rides: count }));
};

/**
 * GET GLOBAL STATS (Super Admin)
 */
export const getGlobalStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const [userCount, universityCount, routeCount, globalImpact, universities] =
      await Promise.all([
        prisma.user.count(),
        prisma.university.count(),
        prisma.route.count({ where: { status: "COMPLETED" } }),
        prisma.user.aggregate({
          _sum: { co2Saved: true, fuelSaved: true },
        }),
        prisma.university.findMany({
          include: { _count: { select: { users: true } } },
        }),
      ]);

    // Build university performance data for bar chart
    const universityPerformance = universities.map((u) => ({
      name: u.shortName,
      users: u._count.users,
    }));

    // Build growth data (last 6 months)
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const now = new Date();
    const growthData = await Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        const nextD = new Date(
          now.getFullYear(),
          now.getMonth() - (5 - i) + 1,
          1,
        );
        return prisma.user
          .count({
            where: { createdAt: { gte: d, lt: nextD } },
          })
          .then((count) => ({
            month: months[d.getMonth()],
            users: count,
          }));
      }),
    );

    res.status(200).json({
      status: "success",
      data: {
        totalUsers: userCount,
        totalUniversities: universityCount,
        totalRides: routeCount,
        totalCo2Saved: globalImpact._sum.co2Saved || 0,
        totalFuelSaved: globalImpact._sum.fuelSaved || 0,
        growthData,
        universityPerformance,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET UNIVERSITY METRICS (University Admin)
 * Uses universityId from request params (or req.user for security)
 */
export const getUniversityMetrics = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Priority: Params if provided, otherwise the admin's own university
    const universityId = req.params.universityId || req.user?.universityId;

    if (!universityId) {
      return next(new AppError("University identification is required.", 400));
    }

    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    // Optimized parallel fetching
    const [stats, activeRidesCount, departments, weeklyRides, students] =
      await Promise.all([
        // 1. Core Totals
        prisma.user.aggregate({
          where: { universityId },
          _count: { id: true },
          _sum: { co2Saved: true, fuelSaved: true },
          _avg: { rating: true },
        }),
        // 2. Currently Active Routes
        prisma.route.count({
          where: {
            driver: { universityId },
            status: "ACCEPTED", // Using 'ACCEPTED' or 'PENDING' based on your Enum for live rides
          },
        }),
        // 3. Dept Distribution for Pie Chart
        prisma.user.groupBy({
          by: ["department"],
          where: { universityId },
          _count: { id: true },
        }),
        // 4. Weekly Trends for Line Chart
        prisma.route.findMany({
          where: {
            driver: { universityId },
            createdAt: { gte: lastWeek },
          },
          select: { createdAt: true },
        }),
        // 5. Student Leaderboard/List
        prisma.user.findMany({
          where: { universityId, role: "STUDENT" },
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
            co2Saved: true,
            ridesOffered: true,
            ridesTaken: true,
            rating: true,
          },
          orderBy: { co2Saved: "desc" },
          take: 20,
        }),
      ]);

    res.status(200).json({
      status: "success",
      data: {
        stats: {
          totalStudents: stats._count.id || 0,
          activeRides: activeRidesCount,
          totalCO2: stats._sum.co2Saved || 0,
          avgRating: stats._avg.rating || 0,
          fuelSaved: stats._sum.fuelSaved || 0,
        },
        departmentDistribution: departments.map((d) => ({
          name: d.department || "General",
          value: d._count.id,
        })),
        weeklyRides: formatWeeklyData(weeklyRides),
        students,
      },
    });
  } catch (error) {
    next(error);
  }
};
/**
 * GET ALL UNIVERSITIES
 */
export const getUniversities = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const universities = await prisma.university.findMany({
      include: {
        _count: { select: { users: true } },
      },
    });
    const data = universities.map((u) => ({
      ...u,
      userCount: u._count.users,
      rideCount: 0,
    }));
    res.status(200).json({ status: "success", data: { universities: data } });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD UNIVERSITY
 */
export const addUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, shortName, emailDomain } = req.body;
    if (!name || !shortName || !emailDomain) {
      return next(new AppError("Please provide all required fields", 400));
    }
    const university = await prisma.university.create({
      data: { name, shortName, emailDomain, isActive: true },
    });
    res.status(201).json({ status: "success", data: { university } });
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE UNIVERSITY
 */
export const updateUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    const { name, shortName, emailDomain, isActive } = req.body;
    const university = await prisma.university.update({
      where: { id },
      data: { name, shortName, emailDomain, isActive },
    });
    res.status(200).json({ status: "success", data: { university } });
  } catch (error) {
    next(error);
  }
};
/**
 * DELETE UNIVERSITY
 */
export const deleteUniversity = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.params.id as string;
    await prisma.university.delete({ where: { id } });
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};


/**
 * GET ALL ADMINS
 */
export const getAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ["SUPER_ADMIN", "UNIVERSITY_ADMIN"] } },
      include: {
        university: { select: { id: true, shortName: true, name: true } },
      },
    });
    res.status(200).json({ status: "success", data: { admins } });
  } catch (error) {
    next(error);
  }
};

/**
 * ADD ADMIN - promote existing user
 */
export const addAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, role, universityId } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return next(new AppError('User not found. They must register first.', 404));
    const updated = await prisma.user.update({
      where: { email },
      data: { role }
    });
    res.status(200).json({ status: 'success', data: { user: updated } });
  } catch (error) { next(error); }
};

/**
 * REVOKE ADMIN - demote back to student
 */
export const revokeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    await prisma.user.update({
      where: { id },
      data: { role: 'STUDENT' }
    });
    res.status(200).json({ status: 'success', message: 'Admin access revoked' });
  } catch (error) { next(error); }
};