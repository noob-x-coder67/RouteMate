import { UserRole, UserRoleAssignment, University } from '@/types';

/**
 * Role checking service
 * Production Version: Logic based on current user session data
 */
export const roleService = {
  /**
   * Check if user has a specific role
   * @param currentUser - Pass the user object from your Auth State/Context
   */
  hasRole: (currentUser: any | null, role: UserRole): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  },

  /**
   * Get user's current role
   */
  getUserRole: (currentUser: any | null): UserRole | null => {
    return currentUser?.role || null;
  },

  /**
   * Check if user can access admin panel for a specific university
   * Logic: Super Admins see all. Uni Admins must match the universityId.
   */
  canAccessAdmin: (currentUser: any | null, targetUniversityId?: string): boolean => {
    if (!currentUser) return false;
    
    const role = currentUser.role as UserRole;
    
    // 1. Super Admin bypass
    if (role === 'SUPER_ADMIN') return true;
    
    // 2. University Admin check
    if (role === 'UNIVERSITY_ADMIN') {
      // If no specific uni is targeted, they have general admin access
      if (!targetUniversityId) return true;
      // Otherwise, match their assigned university
      return currentUser.universityId === targetUniversityId;
    }
    
    return false;
  },

  /**
   * Convenience helpers
   */
  isSuperAdmin: (currentUser: any | null): boolean => {
    return currentUser?.role === 'SUPER_ADMIN';
  },

  isUniversityAdmin: (currentUser: any | null): boolean => {
    return currentUser?.role === 'UNIVERSITY_ADMIN';
  },

  isAnyAdmin: (currentUser: any | null): boolean => {
    const role = currentUser?.role;
    return role === 'SUPER_ADMIN' || role === 'UNIVERSITY_ADMIN';
  },

  /**
   * Get the university object associated with the current admin user
   */
  getUserUniversity: (currentUser: any | null): Partial<University> | null => {
    if (!currentUser || !currentUser.university) return null;
    return currentUser.university;
  }
};