interface ShopifyDiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed_amount' | 'shipping';
  value: string;
  applies_to: 'all' | 'specific';
  status: 'enabled' | 'disabled';
}

export class ShopifyService {
  private shopifyApiUrl: string;
  private accessToken: string;

  constructor() {
    this.shopifyApiUrl = process.env.SHOPIFY_API_URL || '';
    this.accessToken = process.env.SHOPIFY_ACCESS_TOKEN || '';
  }

  async createShippingDiscountCode(code: string, options?: {
    allowedCollections?: string[];
    allowedProducts?: string[];
    restrictToProducts?: boolean;
  }): Promise<string | null> {
    if (!this.shopifyApiUrl || !this.accessToken) {
      console.warn('Shopify API not configured, skipping discount code creation');
      return null;
    }

    try {
      // Create price rule first
      const priceRuleBody: any = {
        price_rule: {
          title: `Free Shipping - ${code}`,
          target_type: 'shipping_line',
          target_selection: 'all',
          allocation_method: 'across',
          value_type: 'percentage',
          value: '-100.0',
          customer_selection: 'all',
          usage_limit: null,
          starts_at: new Date().toISOString(),
        }
      };

      // Add product/collection restrictions if specified
      if (options?.restrictToProducts && (options.allowedProducts?.length || options.allowedCollections?.length)) {
        priceRuleBody.price_rule.target_type = 'line_item';
        priceRuleBody.price_rule.target_selection = 'entitled';
        
        if (options.allowedProducts?.length) {
          priceRuleBody.price_rule.entitled_product_ids = options.allowedProducts;
        }
        if (options.allowedCollections?.length) {
          priceRuleBody.price_rule.entitled_collection_ids = options.allowedCollections;
        }
      }

      const priceRuleResponse = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/price_rules.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken,
        },
        body: JSON.stringify(priceRuleBody),
      });

      if (!priceRuleResponse.ok) {
        throw new Error(`Shopify Price Rule API error: ${priceRuleResponse.statusText}`);
      }

      const priceRuleData = await priceRuleResponse.json();
      const priceRuleId = priceRuleData.price_rule.id;

      // Create discount code for the price rule
      const discountCodeResponse = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/price_rules/${priceRuleId}/discount_codes.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken,
        },
        body: JSON.stringify({
          discount_code: {
            code: code,
          },
        }),
      });

      if (!discountCodeResponse.ok) {
        throw new Error(`Shopify Discount Code API error: ${discountCodeResponse.statusText}`);
      }

      const discountCodeData = await discountCodeResponse.json();
      return discountCodeData.discount_code.id;
    } catch (error) {
      console.error('Failed to create Shopify discount code:', error);
      return null;
    }
  }

  async updateDiscountCodeStatus(discountId: string, enabled: boolean): Promise<boolean> {
    if (!this.shopifyApiUrl || !this.accessToken || !discountId) {
      console.warn('Shopify API not configured or discount ID missing');
      return false;
    }

    try {
      const response = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/discount_codes/${discountId}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': this.accessToken,
        },
        body: JSON.stringify({
          discount_code: {
            status: enabled ? 'enabled' : 'disabled',
          },
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update Shopify discount code status:', error);
      return false;
    }
  }

  async deleteDiscountCode(discountId: string): Promise<boolean> {
    if (!this.shopifyApiUrl || !this.accessToken || !discountId) {
      console.warn('Shopify API not configured or discount ID missing');
      return false;
    }

    try {
      const response = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/discount_codes/${discountId}.json`, {
        method: 'DELETE',
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete Shopify discount code:', error);
      return false;
    }
  }

  async validateDiscountCode(code: string): Promise<boolean> {
    if (!this.shopifyApiUrl || !this.accessToken) {
      console.warn('Shopify API not configured');
      return false;
    }

    try {
      const response = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/discount_codes.json?code=${code}`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.discount_codes && data.discount_codes.length > 0;
    } catch (error) {
      console.error('Failed to validate Shopify discount code:', error);
      return false;
    }
  }

  async getProducts(): Promise<any[]> {
    if (!this.shopifyApiUrl || !this.accessToken) {
      console.warn('Shopify API not configured');
      return [];
    }

    try {
      const response = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/products.json?limit=250`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Failed to fetch Shopify products:', error);
      return [];
    }
  }

  async getCollections(): Promise<any[]> {
    if (!this.shopifyApiUrl || !this.accessToken) {
      console.warn('Shopify API not configured');
      return [];
    }

    try {
      const response = await fetch(`${this.shopifyApiUrl}/admin/api/2023-10/collections.json?limit=250`, {
        headers: {
          'X-Shopify-Access-Token': this.accessToken,
        },
      });

      if (!response.ok) {
        throw new Error(`Shopify API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.collections || [];
    } catch (error) {
      console.error('Failed to fetch Shopify collections:', error);
      return [];
    }
  }
}

export const shopifyService = new ShopifyService();
