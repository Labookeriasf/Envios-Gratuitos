import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { shopifyService } from "./services/shopify";
import { insertInstitutionSchema, insertDiscountUsageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Recent activity
  app.get("/api/dashboard/activity", async (req, res) => {
    try {
      const activity = await storage.getRecentActivity();
      res.json(activity);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // Get all institutions
  app.get("/api/institutions", async (req, res) => {
    try {
      const institutions = await storage.getAllInstitutions();
      res.json(institutions);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      res.status(500).json({ message: "Failed to fetch institutions" });
    }
  });

  // Get institution by ID
  app.get("/api/institutions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid institution ID" });
      }

      const institution = await storage.getInstitution(id);
      if (!institution) {
        return res.status(404).json({ message: "Institution not found" });
      }

      res.json(institution);
    } catch (error) {
      console.error("Error fetching institution:", error);
      res.status(500).json({ message: "Failed to fetch institution" });
    }
  });

  // Create new institution
  app.post("/api/institutions", async (req, res) => {
    try {
      const validatedData = insertInstitutionSchema.parse(req.body);
      
      // Create institution
      const institution = await storage.createInstitution(validatedData);
      
      // Create Shopify discount code with restrictions
      const shopifyDiscountId = await shopifyService.createShippingDiscountCode(institution.code, {
        allowedCollections: validatedData.allowedCollections,
        allowedProducts: validatedData.allowedProducts,
        restrictToProducts: validatedData.restrictToProducts,
      });
      
      // Update institution with Shopify discount ID
      if (shopifyDiscountId) {
        await storage.updateInstitution(institution.id, {
          shopifyDiscountId,
        });
      }

      const updatedInstitution = await storage.getInstitution(institution.id);
      res.status(201).json(updatedInstitution);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error creating institution:", error);
      res.status(500).json({ message: "Failed to create institution" });
    }
  });

  // Update institution
  app.put("/api/institutions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid institution ID" });
      }

      const updates = req.body;
      
      // If updating isActive status, also update Shopify discount code
      if ('isActive' in updates) {
        const institution = await storage.getInstitution(id);
        if (institution?.shopifyDiscountId) {
          await shopifyService.updateDiscountCodeStatus(institution.shopifyDiscountId, updates.isActive);
        }
      }

      const updatedInstitution = await storage.updateInstitution(id, updates);
      if (!updatedInstitution) {
        return res.status(404).json({ message: "Institution not found" });
      }

      res.json(updatedInstitution);
    } catch (error) {
      console.error("Error updating institution:", error);
      res.status(500).json({ message: "Failed to update institution" });
    }
  });

  // Delete institution
  app.delete("/api/institutions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid institution ID" });
      }

      // Get institution to delete Shopify discount code
      const institution = await storage.getInstitution(id);
      if (institution?.shopifyDiscountId) {
        await shopifyService.deleteDiscountCode(institution.shopifyDiscountId);
      }

      const deleted = await storage.deleteInstitution(id);
      if (!deleted) {
        return res.status(404).json({ message: "Institution not found" });
      }

      res.json({ message: "Institution deleted successfully" });
    } catch (error) {
      console.error("Error deleting institution:", error);
      res.status(500).json({ message: "Failed to delete institution" });
    }
  });

  // Regenerate institution code
  app.post("/api/institutions/:id/regenerate-code", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid institution ID" });
      }

      const institution = await storage.getInstitution(id);
      if (!institution) {
        return res.status(404).json({ message: "Institution not found" });
      }

      // Delete old Shopify discount code
      if (institution.shopifyDiscountId) {
        await shopifyService.deleteDiscountCode(institution.shopifyDiscountId);
      }

      // Generate new code
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const newCode = `INST-${year}-${randomNum}`;

      // Create new Shopify discount code
      const shopifyDiscountId = await shopifyService.createShippingDiscountCode(newCode);

      // Update institution
      const updatedInstitution = await storage.updateInstitution(id, {
        code: newCode,
        shopifyDiscountId,
      });

      res.json(updatedInstitution);
    } catch (error) {
      console.error("Error regenerating institution code:", error);
      res.status(500).json({ message: "Failed to regenerate institution code" });
    }
  });

  // Record discount usage
  app.post("/api/discount-usage", async (req, res) => {
    try {
      const validatedData = insertDiscountUsageSchema.parse(req.body);
      const usage = await storage.recordDiscountUsage(validatedData);
      res.status(201).json(usage);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input data", errors: error.errors });
      }
      console.error("Error recording discount usage:", error);
      res.status(500).json({ message: "Failed to record discount usage" });
    }
  });

  // Get discount usage by institution
  app.get("/api/institutions/:id/usage", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid institution ID" });
      }

      const usage = await storage.getDiscountUsageByInstitution(id);
      res.json(usage);
    } catch (error) {
      console.error("Error fetching discount usage:", error);
      res.status(500).json({ message: "Failed to fetch discount usage" });
    }
  });

  // Validate discount code
  app.get("/api/validate-code/:code", async (req, res) => {
    try {
      const { code } = req.params;
      
      // Check if institution exists and is active
      const institution = await storage.getInstitutionByCode(code);
      if (!institution) {
        return res.status(404).json({ message: "Código de descuento inválido" });
      }

      if (!institution.isActive) {
        return res.status(400).json({ message: "Este código de descuento está inactivo" });
      }

      // Validate with Shopify
      const isValid = await shopifyService.validateDiscountCode(code);
      if (!isValid) {
        return res.status(400).json({ message: "El código no es válido en Shopify" });
      }

      res.json({ 
        valid: true, 
        institution: {
          id: institution.id,
          name: institution.name,
          code: institution.code,
        }
      });
    } catch (error) {
      console.error("Error validating discount code:", error);
      res.status(500).json({ message: "Error al validar el código de descuento" });
    }
  });

  // Webhook for Shopify order processing
  app.post("/api/webhook/shopify/order", async (req, res) => {
    try {
      const order = req.body;
      
      // Check if order has discount codes
      if (order.discount_codes && order.discount_codes.length > 0) {
        for (const discountCode of order.discount_codes) {
          // Find institution by code
          const institution = await storage.getInstitutionByCode(discountCode.code);
          
          if (institution && institution.isActive) {
            // Record discount usage
            await storage.recordDiscountUsage({
              institutionId: institution.id,
              orderId: order.order_number || order.id.toString(),
              discountAmount: Math.round((discountCode.amount || 0) * 100), // Convert to cents
            });
            
            console.log(`Recorded discount usage for institution ${institution.name}, order ${order.order_number}`);
          }
        }
      }
      
      res.status(200).json({ message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Error processing Shopify webhook:", error);
      res.status(500).json({ message: "Failed to process webhook" });
    }
  });

  // Public API endpoint for embedding in Shopify frontend
  app.get("/api/public/validate-institution/:code", async (req, res) => {
    try {
      const { code } = req.params;
      
      // Allow CORS for Shopify domains
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      
      const institution = await storage.getInstitutionByCode(code.toUpperCase());
      
      if (!institution || !institution.isActive) {
        return res.status(404).json({ 
          valid: false, 
          message: "Código inválido o inactivo" 
        });
      }
      
      res.json({
        valid: true,
        institution: {
          name: institution.name,
          code: institution.code,
        },
        discount: {
          type: "free_shipping",
          description: "Envío gratuito para " + institution.name
        }
      });
    } catch (error) {
      console.error("Error in public validation:", error);
      res.status(500).json({ valid: false, message: "Error del servidor" });
    }
  });

  // Get Shopify products for institution configuration
  app.get("/api/shopify/products", async (req, res) => {
    try {
      const products = await shopifyService.getProducts();
      res.json(products.map(product => ({
        id: product.id.toString(),
        title: product.title,
        handle: product.handle,
        status: product.status,
      })));
    } catch (error) {
      console.error("Error fetching Shopify products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get Shopify collections for institution configuration
  app.get("/api/shopify/collections", async (req, res) => {
    try {
      const collections = await shopifyService.getCollections();
      res.json(collections.map(collection => ({
        id: collection.id.toString(),
        title: collection.title,
        handle: collection.handle,
        products_count: collection.products_count,
      })));
    } catch (error) {
      console.error("Error fetching Shopify collections:", error);
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
