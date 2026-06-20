import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: string;
  discountPrice: string | null;
  stock: number;
  categoryId: string;
  imageUrl: string;
  rating: string;
  featured: boolean;
}

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'Order'],
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
    }),
    createOrder: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Order'],
    }),
    getUserOrders: builder.query<any[], string>({
      query: (uid) => `/users/${uid}/orders`,
      providesTags: ['Order'],
    }),

    getProductReviews: builder.query<any[], string>({
      query: (id) => `/products/${id}/reviews`,
      providesTags: ['Product'],
    }),
    createProductReview: builder.mutation<any, { id: string; review: any }>({
      query: ({ id, review }) => ({
        url: `/products/${id}/reviews`,
        method: 'POST',
        body: review,
      }),
      invalidatesTags: ['Product'],
    }),

    // Admin Product Management
    adminCreateProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/admin/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    adminUpdateProduct: builder.mutation<Product, { id: string; changes: Partial<Product> }>({
      query: ({ id, changes }) => ({
        url: `/admin/products/${id}`,
        method: 'PUT',
        body: changes,
      }),
      invalidatesTags: ['Product'],
    }),
    adminDeleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/admin/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Admin Order Management
    adminGetOrders: builder.query<any[], void>({
      query: () => '/admin/orders',
      providesTags: ['Order'],
    }),
    adminGetCustomers: builder.query<any[], void>({
      query: () => '/admin/customers',
    }),
    adminGetDashboard: builder.query<any, void>({
      query: () => '/admin/dashboard',
      providesTags: ['Order'], // Invalidate/refetch when orders change
    }),
    adminUpdateOrderStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/admin/orders/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useCreateOrderMutation,
  useGetUserOrdersQuery,
  useGetProductReviewsQuery,
  useCreateProductReviewMutation,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
  useAdminGetOrdersQuery,
  useAdminGetDashboardQuery,
  useAdminGetCustomersQuery,
  useAdminUpdateOrderStatusMutation,
} = apiSlice;
