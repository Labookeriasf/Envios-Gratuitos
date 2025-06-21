import { institutions, discountUsage, type Institution, type InsertInstitution, type DiscountUsage, type InsertDiscountUsage } from "@shared/schema";
import { db } from "./db";
import { eq, desc, count, sum, sql } from "drizzle-orm";

export interface IStorage {
  // Institutions
  createInstitution(institution: InsertInstitution): Promise<Institution>;
  getInstitution(id: number): Promise<Institution | undefined>;
  getInstitutionByCode(code: string): Promise<Institution | undefined>;
  getAllInstitutions(): Promise<Institution[]>;
  updateInstitution(id: number, updates: Partial<Institution>): Promise<Institution | undefined>;
  deleteInstitution(id: number): Promise<boolean>;
  
  // Discount Usage
  recordDiscountUsage(usage: InsertDiscountUsage): Promise<DiscountUsage>;
  getDiscountUsageByInstitution(institutionId: number): Promise<DiscountUsage[]>;
  
  // Statistics
  getDashboardStats(): Promise<{
    activeInstitutions: number;
    totalDiscountCodes: number;
    totalFreeShipments: number;
    totalSavings: number;
  }>;
  
  getRecentActivity(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  async createInstitution(insertInstitution: InsertInstitution): Promise<Institution> {
    const code = this.generateInstitutionCode();
    const [institution] = await db
      .insert(institutions)
      .values({
        ...insertInstitution,
        code,
      })
      .returning();
    return institution;
  }

  async getInstitution(id: number): Promise<Institution | undefined> {
    const [institution] = await db.select().from(institutions).where(eq(institutions.id, id));
    return institution;
  }

  async getInstitutionByCode(code: string): Promise<Institution | undefined> {
    const [institution] = await db.select().from(institutions).where(eq(institutions.code, code));
    return institution;
  }

  async getAllInstitutions(): Promise<Institution[]> {
    return await db.select().from(institutions).orderBy(desc(institutions.createdAt));
  }

  async updateInstitution(id: number, updates: Partial<Institution>): Promise<Institution | undefined> {
    const [institution] = await db
      .update(institutions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(institutions.id, id))
      .returning();
    return institution;
  }

  async deleteInstitution(id: number): Promise<boolean> {
    const result = await db.delete(institutions).where(eq(institutions.id, id));
    return (result.rowCount || 0) > 0;
  }

  async recordDiscountUsage(usage: InsertDiscountUsage): Promise<DiscountUsage> {
    const [discountUsageRecord] = await db
      .insert(discountUsage)
      .values(usage)
      .returning();
    return discountUsageRecord;
  }

  async getDiscountUsageByInstitution(institutionId: number): Promise<DiscountUsage[]> {
    return await db
      .select()
      .from(discountUsage)
      .where(eq(discountUsage.institutionId, institutionId))
      .orderBy(desc(discountUsage.usedAt));
  }

  async getDashboardStats(): Promise<{
    activeInstitutions: number;
    totalDiscountCodes: number;
    totalFreeShipments: number;
    totalSavings: number;
  }> {
    const [activeInstitutionsResult] = await db
      .select({ count: count() })
      .from(institutions)
      .where(eq(institutions.isActive, true));

    const [totalInstitutionsResult] = await db
      .select({ count: count() })
      .from(institutions);

    const [shipmentsResult] = await db
      .select({ 
        count: count(),
        total: sum(discountUsage.discountAmount)
      })
      .from(discountUsage);

    return {
      activeInstitutions: activeInstitutionsResult.count,
      totalDiscountCodes: totalInstitutionsResult.count,
      totalFreeShipments: shipmentsResult.count || 0,
      totalSavings: Math.round((Number(shipmentsResult.total) || 0) / 100), // Convert cents to dollars
    };
  }

  async getRecentActivity(): Promise<any[]> {
    // Get recent institutions and discount usage
    const recentInstitutions = await db
      .select({
        type: sql<string>`'institution'`,
        description: institutions.name,
        createdAt: institutions.createdAt,
        status: institutions.isActive,
      })
      .from(institutions)
      .orderBy(desc(institutions.createdAt))
      .limit(5);

    const recentUsage = await db
      .select({
        type: sql<string>`'usage'`,
        description: discountUsage.orderId,
        createdAt: discountUsage.usedAt,
        status: sql<boolean>`true`,
      })
      .from(discountUsage)
      .orderBy(desc(discountUsage.usedAt))
      .limit(5);

    return [...recentInstitutions, ...recentUsage]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }

  private generateInstitutionCode(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INST-${year}-${randomNum}`;
  }
}

export const storage = new DatabaseStorage();
