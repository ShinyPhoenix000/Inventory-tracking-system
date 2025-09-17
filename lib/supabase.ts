// Mock supabase client for compatibility
export const supabase = {
	auth: {
		async updateUser(data: any) {
			return { error: null };
		},
		async signOut() {
			return { error: null };
		},
	},
	async rpc(name: string, params: any) {
		return { error: null };
	},
				from(table: string) {
					// Mock query builder
					return {
						select(...args: any[]) {
							// Return sample order data for Analytics
							const sampleOrders = [
								{
									id: '1',
									quantity: 10,
									created_at: new Date().toISOString(),
									product_id: 'p1',
									products: { name: 'Widget', price: 25, quantity: 100 },
								},
								{
									id: '2',
									quantity: 5,
									created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
									product_id: 'p2',
									products: { name: 'Gadget', price: 40, quantity: 50 },
								},
							];
							return Promise.resolve({ data: sampleOrders, error: null });
						},
						eq() {
							return Promise.resolve({ data: [], error: null });
						},
					};
				},
};
