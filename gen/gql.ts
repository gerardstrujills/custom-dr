import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTimeISO: { input: any; output: any; }
};

export type BulkEntryError = {
  __typename?: 'BulkEntryError';
  field: Scalars['String']['output'];
  index?: Maybe<Scalars['Int']['output']>;
  message: Scalars['String']['output'];
  productId?: Maybe<Scalars['Float']['output']>;
  ruc?: Maybe<Scalars['String']['output']>;
};

export type BulkEntryInput = {
  entries: Array<EntryInput>;
};

export type BulkEntryResponse = {
  __typename?: 'BulkEntryResponse';
  errorCount: Scalars['Int']['output'];
  results: Array<BulkEntryResult>;
  successCount: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type BulkEntryResult = {
  __typename?: 'BulkEntryResult';
  entry?: Maybe<Entry>;
  errors?: Maybe<Array<BulkEntryError>>;
};

export type BulkProductItemResponse = {
  __typename?: 'BulkProductItemResponse';
  error?: Maybe<ProductBulkError>;
  index: Scalars['Int']['output'];
  product?: Maybe<Product>;
};

export type Entry = {
  __typename?: 'Entry';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  product: Product;
  productId?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Float']['output'];
  startTime: Scalars['DateTimeISO']['output'];
  supplier: Supplier;
  supplierId?: Maybe<Scalars['Int']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type EntryFieldError = {
  __typename?: 'EntryFieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type EntryInput = {
  price: Scalars['Float']['input'];
  productId: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  ruc: Scalars['String']['input'];
  startTime: Scalars['DateTimeISO']['input'];
};

export type EntryResponse = {
  __typename?: 'EntryResponse';
  entry?: Maybe<Entry>;
  errors?: Maybe<Array<EntryFieldError>>;
};

export type EntryUpdateInput = {
  price: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  startTime: Scalars['DateTimeISO']['input'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type IncomeFilters = {
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  materialType?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  supplierDepartment?: InputMaybe<Scalars['String']['input']>;
  supplierDistrict?: InputMaybe<Scalars['String']['input']>;
  supplierName?: InputMaybe<Scalars['String']['input']>;
  supplierProvince?: InputMaybe<Scalars['String']['input']>;
  supplierRuc?: InputMaybe<Scalars['String']['input']>;
  unitOfMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type IncomeResponse = {
  __typename?: 'IncomeResponse';
  createdAt: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  price: Scalars['Float']['output'];
  product: ProductInfo;
  quantity: Scalars['Int']['output'];
  startTime: Scalars['DateTimeISO']['output'];
  supplier: SupplierInfo;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  bulkCreateProducts: ProductBulkResponse;
  createBulkEntries: BulkEntryResponse;
  createEntry: EntryResponse;
  createProduct: ProductResponse;
  createSupplier: SupplierResponse;
  createSupplierRuc: SupplierResponse;
  createWithdrawal: WithdrawalResponse;
  deleteEntry: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteSupplier: Scalars['Boolean']['output'];
  deleteWithdrawal: Scalars['Boolean']['output'];
  login: UserResponse;
  logout: Scalars['Boolean']['output'];
  updateEntry: EntryResponse;
  updateProduct: ProductResponse;
  updateWithdrawal: WithdrawalResponse;
};


export type MutationBulkCreateProductsArgs = {
  input: ProductBulkCreateInput;
};


export type MutationCreateBulkEntriesArgs = {
  input: BulkEntryInput;
};


export type MutationCreateEntryArgs = {
  input: EntryInput;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationCreateSupplierArgs = {
  input: SupplierInput;
};


export type MutationCreateSupplierRucArgs = {
  input: SupplierRuc;
};


export type MutationCreateWithdrawalArgs = {
  input: WithdrawalInput;
};


export type MutationDeleteEntryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteSupplierArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteWithdrawalArgs = {
  id: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
};


export type MutationUpdateEntryArgs = {
  id: Scalars['Int']['input'];
  input: EntryUpdateInput;
};


export type MutationUpdateProductArgs = {
  id: Scalars['Float']['input'];
  input: ProductInput;
};


export type MutationUpdateWithdrawalArgs = {
  id: Scalars['Int']['input'];
  input: WithdrawalUpdateInput;
};

export type Product = {
  __typename?: 'Product';
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  entry: Array<Entry>;
  id: Scalars['Int']['output'];
  materialType: Scalars['String']['output'];
  title: Scalars['String']['output'];
  unitOfMeasurement: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
  withdrawal: Array<Withdrawal>;
};

export type ProductBulkCreateInput = {
  products: Array<ProductBulkInput>;
};

export type ProductBulkError = {
  __typename?: 'ProductBulkError';
  field: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  message: Scalars['String']['output'];
};

export type ProductBulkInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  materialType: Scalars['String']['input'];
  title: Scalars['String']['input'];
  unitOfMeasurement: Scalars['String']['input'];
};

export type ProductBulkResponse = {
  __typename?: 'ProductBulkResponse';
  errors?: Maybe<Array<ProductBulkError>>;
  results: Array<BulkProductItemResponse>;
  totalCreated: Scalars['Int']['output'];
  totalFailed: Scalars['Int']['output'];
};

export type ProductFieldError = {
  __typename?: 'ProductFieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type ProductInfo = {
  __typename?: 'ProductInfo';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  materialType: Scalars['String']['output'];
  title: Scalars['String']['output'];
  unitOfMeasurement: Scalars['String']['output'];
};

export type ProductInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  materialType: Scalars['String']['input'];
  title: Scalars['String']['input'];
  unitOfMeasurement: Scalars['String']['input'];
};

export type ProductResponse = {
  __typename?: 'ProductResponse';
  errors?: Maybe<Array<ProductFieldError>>;
  product?: Maybe<Product>;
};

export type Query = {
  __typename?: 'Query';
  entries?: Maybe<Array<Entry>>;
  incomes?: Maybe<Array<IncomeResponse>>;
  me?: Maybe<User>;
  products?: Maybe<Array<Product>>;
  stock?: Maybe<Array<StockResponse>>;
  supplier?: Maybe<Supplier>;
  suppliers?: Maybe<Array<Supplier>>;
  withdrawals?: Maybe<Array<WithdrawalKardexResponse>>;
};


export type QueryIncomesArgs = {
  filters?: InputMaybe<IncomeFilters>;
};


export type QueryStockArgs = {
  filters?: InputMaybe<StockFilters>;
};


export type QuerySupplierArgs = {
  id: Scalars['Int']['input'];
};


export type QueryWithdrawalsArgs = {
  filters?: InputMaybe<WithdrawalFilters>;
};

export type StockFilters = {
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  materialType?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  supplierDepartment?: InputMaybe<Scalars['String']['input']>;
  supplierDistrict?: InputMaybe<Scalars['String']['input']>;
  supplierName?: InputMaybe<Scalars['String']['input']>;
  supplierProvince?: InputMaybe<Scalars['String']['input']>;
  supplierRuc?: InputMaybe<Scalars['String']['input']>;
  unitOfMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type StockResponse = {
  __typename?: 'StockResponse';
  averagePrice: Scalars['Float']['output'];
  createdAt: Scalars['DateTimeISO']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  materialType: Scalars['String']['output'];
  title: Scalars['String']['output'];
  totalStock: Scalars['Int']['output'];
  totalValue: Scalars['Float']['output'];
  unitOfMeasurement: Scalars['String']['output'];
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type Supplier = {
  __typename?: 'Supplier';
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTimeISO']['output'];
  department?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  entry: Array<Entry>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  productCount: Scalars['Int']['output'];
  province?: Maybe<Scalars['String']['output']>;
  ruc?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type SupplierFieldError = {
  __typename?: 'SupplierFieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type SupplierInfo = {
  __typename?: 'SupplierInfo';
  department?: Maybe<Scalars['String']['output']>;
  district?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  province?: Maybe<Scalars['String']['output']>;
  ruc?: Maybe<Scalars['String']['output']>;
};

export type SupplierInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  district?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  province?: InputMaybe<Scalars['String']['input']>;
};

export type SupplierResponse = {
  __typename?: 'SupplierResponse';
  errors?: Maybe<Array<SupplierFieldError>>;
  supplier?: Maybe<Supplier>;
};

export type SupplierRuc = {
  ruc: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  isAccess: Scalars['Boolean']['output'];
  updatedAt: Scalars['String']['output'];
  username: Scalars['String']['output'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type Withdrawal = {
  __typename?: 'Withdrawal';
  createdAt: Scalars['DateTimeISO']['output'];
  endTime: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  productId?: Maybe<Scalars['Int']['output']>;
  quantity: Scalars['Float']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type WithdrawalFieldError = {
  __typename?: 'WithdrawalFieldError';
  field: Scalars['String']['output'];
  message: Scalars['String']['output'];
};

export type WithdrawalFilters = {
  description?: InputMaybe<Scalars['String']['input']>;
  endTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  materialType?: InputMaybe<Scalars['String']['input']>;
  startTime?: InputMaybe<Scalars['DateTimeISO']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
  unitOfMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type WithdrawalInput = {
  endTime: Scalars['DateTimeISO']['input'];
  productId: Scalars['Float']['input'];
  quantity: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export type WithdrawalKardexResponse = {
  __typename?: 'WithdrawalKardexResponse';
  createdAt: Scalars['DateTimeISO']['output'];
  endTime: Scalars['DateTimeISO']['output'];
  id: Scalars['Int']['output'];
  product: WithdrawalProductInfo;
  quantity: Scalars['Int']['output'];
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTimeISO']['output'];
};

export type WithdrawalProductInfo = {
  __typename?: 'WithdrawalProductInfo';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  materialType: Scalars['String']['output'];
  title: Scalars['String']['output'];
  unitOfMeasurement: Scalars['String']['output'];
};

export type WithdrawalResponse = {
  __typename?: 'WithdrawalResponse';
  errors?: Maybe<Array<WithdrawalFieldError>>;
  withdrawal?: Maybe<Withdrawal>;
};

export type WithdrawalUpdateInput = {
  endTime: Scalars['DateTimeISO']['input'];
  quantity: Scalars['Float']['input'];
  title: Scalars['String']['input'];
};

export type LoginMutationVariables = Exact<{
  password: Scalars['String']['input'];
  usernameOrEmail: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', user?: { __typename?: 'User', email: string, username: string, isAccess: boolean } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type CreateBulkEntriesMutationVariables = Exact<{
  input: BulkEntryInput;
}>;


export type CreateBulkEntriesMutation = { __typename?: 'Mutation', createBulkEntries: { __typename?: 'BulkEntryResponse', total: number, successCount: number, errorCount: number, results: Array<{ __typename?: 'BulkEntryResult', entry?: { __typename?: 'Entry', id: number, quantity: number, price: number, startTime: any, createdAt: any, updatedAt: any, supplier: { __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any }, product: { __typename?: 'Product', id: number, title: string } } | null, errors?: Array<{ __typename?: 'BulkEntryError', index?: number | null, field: string, message: string, ruc?: string | null, productId?: number | null }> | null }> } };

export type CreateEntryMutationVariables = Exact<{
  input: EntryInput;
}>;


export type CreateEntryMutation = { __typename?: 'Mutation', createEntry: { __typename?: 'EntryResponse', entry?: { __typename?: 'Entry', id: number, quantity: number, price: number, startTime: any, createdAt: any, updatedAt: any, supplier: { __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any } } | null, errors?: Array<{ __typename?: 'EntryFieldError', field: string, message: string }> | null } };

export type DeleteEntryMutationVariables = Exact<{
  deleteEntryId: Scalars['Int']['input'];
}>;


export type DeleteEntryMutation = { __typename?: 'Mutation', deleteEntry: boolean };

export type UpdateEntryMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: EntryUpdateInput;
}>;


export type UpdateEntryMutation = { __typename?: 'Mutation', updateEntry: { __typename?: 'EntryResponse', entry?: { __typename?: 'Entry', id: number, quantity: number, price: number, startTime: any, createdAt: any, updatedAt: any, supplier: { __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any } } | null, errors?: Array<{ __typename?: 'EntryFieldError', field: string, message: string }> | null } };

export type BulkCreateProductsMutationVariables = Exact<{
  input: ProductBulkCreateInput;
}>;


export type BulkCreateProductsMutation = { __typename?: 'Mutation', bulkCreateProducts: { __typename?: 'ProductBulkResponse', totalCreated: number, totalFailed: number, errors?: Array<{ __typename?: 'ProductBulkError', index: number, field: string, message: string }> | null, results: Array<{ __typename?: 'BulkProductItemResponse', index: number, product?: { __typename?: 'Product', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string, createdAt: any, updatedAt: any } | null, error?: { __typename?: 'ProductBulkError', index: number, field: string, message: string } | null }> } };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type CreateSupplierMutationVariables = Exact<{
  input: SupplierInput;
}>;


export type CreateSupplierMutation = { __typename?: 'Mutation', createSupplier: { __typename?: 'SupplierResponse', supplier?: { __typename?: 'Supplier', id: number } | null, errors?: Array<{ __typename?: 'SupplierFieldError', field: string, message: string }> | null } };

export type DeleteSupplierMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteSupplierMutation = { __typename?: 'Mutation', deleteSupplier: boolean };

export type CreateSupplierRucMutationVariables = Exact<{
  input: SupplierRuc;
}>;


export type CreateSupplierRucMutation = { __typename?: 'Mutation', createSupplierRuc: { __typename?: 'SupplierResponse', supplier?: { __typename?: 'Supplier', id: number } | null, errors?: Array<{ __typename?: 'SupplierFieldError', field: string, message: string }> | null } };

export type CreateWithdrawalMutationVariables = Exact<{
  input: WithdrawalInput;
}>;


export type CreateWithdrawalMutation = { __typename?: 'Mutation', createWithdrawal: { __typename?: 'WithdrawalResponse', withdrawal?: { __typename?: 'Withdrawal', id: number, title?: string | null, quantity: number, endTime: any, createdAt: any, updatedAt: any } | null, errors?: Array<{ __typename?: 'WithdrawalFieldError', field: string, message: string }> | null } };

export type DeleteWithdrawalMutationVariables = Exact<{
  deleteWithdrawalId: Scalars['Int']['input'];
}>;


export type DeleteWithdrawalMutation = { __typename?: 'Mutation', deleteWithdrawal: boolean };

export type UpdateWithdrawalMutationVariables = Exact<{
  input: WithdrawalUpdateInput;
  updateWithdrawalId: Scalars['Int']['input'];
}>;


export type UpdateWithdrawalMutation = { __typename?: 'Mutation', updateWithdrawal: { __typename?: 'WithdrawalResponse', withdrawal?: { __typename?: 'Withdrawal', id: number, title?: string | null, quantity: number, endTime: any, createdAt: any, updatedAt: any } | null, errors?: Array<{ __typename?: 'WithdrawalFieldError', field: string, message: string }> | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', email: string, username: string, isAccess: boolean } | null };

export type IncomesQueryVariables = Exact<{
  filters: IncomeFilters;
}>;


export type IncomesQuery = { __typename?: 'Query', incomes?: Array<{ __typename?: 'IncomeResponse', id: number, quantity: number, price: number, startTime: any, createdAt: any, product: { __typename?: 'ProductInfo', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string }, supplier: { __typename?: 'SupplierInfo', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null } }> | null };

export type WithdrawalsQueryVariables = Exact<{
  filters: WithdrawalFilters;
}>;


export type WithdrawalsQuery = { __typename?: 'Query', withdrawals?: Array<{ __typename?: 'WithdrawalKardexResponse', id: number, title?: string | null, quantity: number, endTime: any, createdAt: any, product: { __typename?: 'WithdrawalProductInfo', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string } }> | null };

export type StockQueryVariables = Exact<{
  filters: StockFilters;
}>;


export type StockQuery = { __typename?: 'Query', stock?: Array<{ __typename?: 'StockResponse', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string, totalStock: number, averagePrice: number, totalValue: number, createdAt: any }> | null };

export type CreateProductMutationVariables = Exact<{
  input: ProductInput;
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'ProductResponse', product?: { __typename?: 'Product', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string, createdAt: any, updatedAt: any } | null, errors?: Array<{ __typename?: 'ProductFieldError', field: string, message: string }> | null } };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { __typename?: 'Query', products?: Array<{ __typename?: 'Product', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string, createdAt: any, updatedAt: any, withdrawal: Array<{ __typename?: 'Withdrawal', id: number, title?: string | null, quantity: number, endTime: any, createdAt: any, updatedAt: any }>, entry: Array<{ __typename?: 'Entry', id: number, quantity: number, price: number, startTime: any, createdAt: any, updatedAt: any, supplier: { __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any } }> }> | null };

export type SupplierQueryVariables = Exact<{
  supplierId: Scalars['Int']['input'];
}>;


export type SupplierQuery = { __typename?: 'Query', supplier?: { __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any, entry: Array<{ __typename?: 'Entry', id: number, quantity: number, price: number, startTime: any, createdAt: any, updatedAt: any, product: { __typename?: 'Product', id: number, title: string, description?: string | null, unitOfMeasurement: string, materialType: string, createdAt: any, updatedAt: any } }> } | null };

export type SuppliersQueryVariables = Exact<{ [key: string]: never; }>;


export type SuppliersQuery = { __typename?: 'Query', suppliers?: Array<{ __typename?: 'Supplier', id: number, name: string, ruc?: string | null, district?: string | null, province?: string | null, department?: string | null, productCount: number, createdAt: any, updatedAt: any }> | null };


export const LoginDocument = gql`
    mutation Login($password: String!, $usernameOrEmail: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    user {
      email
      username
      isAccess
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      password: // value for 'password'
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const CreateBulkEntriesDocument = gql`
    mutation CreateBulkEntries($input: BulkEntryInput!) {
  createBulkEntries(input: $input) {
    total
    successCount
    errorCount
    results {
      entry {
        id
        quantity
        price
        startTime
        createdAt
        updatedAt
        supplier {
          id
          name
          ruc
          district
          province
          department
          productCount
          createdAt
          updatedAt
        }
        product {
          id
          title
        }
      }
      errors {
        index
        field
        message
        ruc
        productId
      }
    }
  }
}
    `;
export type CreateBulkEntriesMutationFn = Apollo.MutationFunction<CreateBulkEntriesMutation, CreateBulkEntriesMutationVariables>;

/**
 * __useCreateBulkEntriesMutation__
 *
 * To run a mutation, you first call `useCreateBulkEntriesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBulkEntriesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBulkEntriesMutation, { data, loading, error }] = useCreateBulkEntriesMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBulkEntriesMutation(baseOptions?: Apollo.MutationHookOptions<CreateBulkEntriesMutation, CreateBulkEntriesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBulkEntriesMutation, CreateBulkEntriesMutationVariables>(CreateBulkEntriesDocument, options);
      }
export type CreateBulkEntriesMutationHookResult = ReturnType<typeof useCreateBulkEntriesMutation>;
export type CreateBulkEntriesMutationResult = Apollo.MutationResult<CreateBulkEntriesMutation>;
export type CreateBulkEntriesMutationOptions = Apollo.BaseMutationOptions<CreateBulkEntriesMutation, CreateBulkEntriesMutationVariables>;
export const CreateEntryDocument = gql`
    mutation CreateEntry($input: EntryInput!) {
  createEntry(input: $input) {
    entry {
      id
      quantity
      price
      startTime
      createdAt
      updatedAt
      supplier {
        id
        name
        ruc
        district
        province
        department
        productCount
        createdAt
        updatedAt
      }
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateEntryMutationFn = Apollo.MutationFunction<CreateEntryMutation, CreateEntryMutationVariables>;

/**
 * __useCreateEntryMutation__
 *
 * To run a mutation, you first call `useCreateEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createEntryMutation, { data, loading, error }] = useCreateEntryMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateEntryMutation(baseOptions?: Apollo.MutationHookOptions<CreateEntryMutation, CreateEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateEntryMutation, CreateEntryMutationVariables>(CreateEntryDocument, options);
      }
export type CreateEntryMutationHookResult = ReturnType<typeof useCreateEntryMutation>;
export type CreateEntryMutationResult = Apollo.MutationResult<CreateEntryMutation>;
export type CreateEntryMutationOptions = Apollo.BaseMutationOptions<CreateEntryMutation, CreateEntryMutationVariables>;
export const DeleteEntryDocument = gql`
    mutation DeleteEntry($deleteEntryId: Int!) {
  deleteEntry(id: $deleteEntryId)
}
    `;
export type DeleteEntryMutationFn = Apollo.MutationFunction<DeleteEntryMutation, DeleteEntryMutationVariables>;

/**
 * __useDeleteEntryMutation__
 *
 * To run a mutation, you first call `useDeleteEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEntryMutation, { data, loading, error }] = useDeleteEntryMutation({
 *   variables: {
 *      deleteEntryId: // value for 'deleteEntryId'
 *   },
 * });
 */
export function useDeleteEntryMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEntryMutation, DeleteEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEntryMutation, DeleteEntryMutationVariables>(DeleteEntryDocument, options);
      }
export type DeleteEntryMutationHookResult = ReturnType<typeof useDeleteEntryMutation>;
export type DeleteEntryMutationResult = Apollo.MutationResult<DeleteEntryMutation>;
export type DeleteEntryMutationOptions = Apollo.BaseMutationOptions<DeleteEntryMutation, DeleteEntryMutationVariables>;
export const UpdateEntryDocument = gql`
    mutation UpdateEntry($id: Int!, $input: EntryUpdateInput!) {
  updateEntry(id: $id, input: $input) {
    entry {
      id
      quantity
      price
      startTime
      createdAt
      updatedAt
      supplier {
        id
        name
        ruc
        district
        province
        department
        productCount
        createdAt
        updatedAt
      }
    }
    errors {
      field
      message
    }
  }
}
    `;
export type UpdateEntryMutationFn = Apollo.MutationFunction<UpdateEntryMutation, UpdateEntryMutationVariables>;

/**
 * __useUpdateEntryMutation__
 *
 * To run a mutation, you first call `useUpdateEntryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateEntryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateEntryMutation, { data, loading, error }] = useUpdateEntryMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateEntryMutation(baseOptions?: Apollo.MutationHookOptions<UpdateEntryMutation, UpdateEntryMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateEntryMutation, UpdateEntryMutationVariables>(UpdateEntryDocument, options);
      }
export type UpdateEntryMutationHookResult = ReturnType<typeof useUpdateEntryMutation>;
export type UpdateEntryMutationResult = Apollo.MutationResult<UpdateEntryMutation>;
export type UpdateEntryMutationOptions = Apollo.BaseMutationOptions<UpdateEntryMutation, UpdateEntryMutationVariables>;
export const BulkCreateProductsDocument = gql`
    mutation BulkCreateProducts($input: ProductBulkCreateInput!) {
  bulkCreateProducts(input: $input) {
    errors {
      index
      field
      message
    }
    results {
      index
      product {
        id
        title
        description
        unitOfMeasurement
        materialType
        createdAt
        updatedAt
      }
      error {
        index
        field
        message
      }
    }
    totalCreated
    totalFailed
  }
}
    `;
export type BulkCreateProductsMutationFn = Apollo.MutationFunction<BulkCreateProductsMutation, BulkCreateProductsMutationVariables>;

/**
 * __useBulkCreateProductsMutation__
 *
 * To run a mutation, you first call `useBulkCreateProductsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBulkCreateProductsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [bulkCreateProductsMutation, { data, loading, error }] = useBulkCreateProductsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useBulkCreateProductsMutation(baseOptions?: Apollo.MutationHookOptions<BulkCreateProductsMutation, BulkCreateProductsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BulkCreateProductsMutation, BulkCreateProductsMutationVariables>(BulkCreateProductsDocument, options);
      }
export type BulkCreateProductsMutationHookResult = ReturnType<typeof useBulkCreateProductsMutation>;
export type BulkCreateProductsMutationResult = Apollo.MutationResult<BulkCreateProductsMutation>;
export type BulkCreateProductsMutationOptions = Apollo.BaseMutationOptions<BulkCreateProductsMutation, BulkCreateProductsMutationVariables>;
export const DeleteProductDocument = gql`
    mutation DeleteProduct($id: Int!) {
  deleteProduct(id: $id)
}
    `;
export type DeleteProductMutationFn = Apollo.MutationFunction<DeleteProductMutation, DeleteProductMutationVariables>;

/**
 * __useDeleteProductMutation__
 *
 * To run a mutation, you first call `useDeleteProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProductMutation, { data, loading, error }] = useDeleteProductMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteProductMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProductMutation, DeleteProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProductMutation, DeleteProductMutationVariables>(DeleteProductDocument, options);
      }
export type DeleteProductMutationHookResult = ReturnType<typeof useDeleteProductMutation>;
export type DeleteProductMutationResult = Apollo.MutationResult<DeleteProductMutation>;
export type DeleteProductMutationOptions = Apollo.BaseMutationOptions<DeleteProductMutation, DeleteProductMutationVariables>;
export const CreateSupplierDocument = gql`
    mutation CreateSupplier($input: SupplierInput!) {
  createSupplier(input: $input) {
    supplier {
      id
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateSupplierMutationFn = Apollo.MutationFunction<CreateSupplierMutation, CreateSupplierMutationVariables>;

/**
 * __useCreateSupplierMutation__
 *
 * To run a mutation, you first call `useCreateSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSupplierMutation, { data, loading, error }] = useCreateSupplierMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSupplierMutation(baseOptions?: Apollo.MutationHookOptions<CreateSupplierMutation, CreateSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSupplierMutation, CreateSupplierMutationVariables>(CreateSupplierDocument, options);
      }
export type CreateSupplierMutationHookResult = ReturnType<typeof useCreateSupplierMutation>;
export type CreateSupplierMutationResult = Apollo.MutationResult<CreateSupplierMutation>;
export type CreateSupplierMutationOptions = Apollo.BaseMutationOptions<CreateSupplierMutation, CreateSupplierMutationVariables>;
export const DeleteSupplierDocument = gql`
    mutation deleteSupplier($id: Int!) {
  deleteSupplier(id: $id)
}
    `;
export type DeleteSupplierMutationFn = Apollo.MutationFunction<DeleteSupplierMutation, DeleteSupplierMutationVariables>;

/**
 * __useDeleteSupplierMutation__
 *
 * To run a mutation, you first call `useDeleteSupplierMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteSupplierMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteSupplierMutation, { data, loading, error }] = useDeleteSupplierMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteSupplierMutation(baseOptions?: Apollo.MutationHookOptions<DeleteSupplierMutation, DeleteSupplierMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteSupplierMutation, DeleteSupplierMutationVariables>(DeleteSupplierDocument, options);
      }
export type DeleteSupplierMutationHookResult = ReturnType<typeof useDeleteSupplierMutation>;
export type DeleteSupplierMutationResult = Apollo.MutationResult<DeleteSupplierMutation>;
export type DeleteSupplierMutationOptions = Apollo.BaseMutationOptions<DeleteSupplierMutation, DeleteSupplierMutationVariables>;
export const CreateSupplierRucDocument = gql`
    mutation CreateSupplierRuc($input: SupplierRuc!) {
  createSupplierRuc(input: $input) {
    supplier {
      id
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateSupplierRucMutationFn = Apollo.MutationFunction<CreateSupplierRucMutation, CreateSupplierRucMutationVariables>;

/**
 * __useCreateSupplierRucMutation__
 *
 * To run a mutation, you first call `useCreateSupplierRucMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateSupplierRucMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createSupplierRucMutation, { data, loading, error }] = useCreateSupplierRucMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateSupplierRucMutation(baseOptions?: Apollo.MutationHookOptions<CreateSupplierRucMutation, CreateSupplierRucMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateSupplierRucMutation, CreateSupplierRucMutationVariables>(CreateSupplierRucDocument, options);
      }
export type CreateSupplierRucMutationHookResult = ReturnType<typeof useCreateSupplierRucMutation>;
export type CreateSupplierRucMutationResult = Apollo.MutationResult<CreateSupplierRucMutation>;
export type CreateSupplierRucMutationOptions = Apollo.BaseMutationOptions<CreateSupplierRucMutation, CreateSupplierRucMutationVariables>;
export const CreateWithdrawalDocument = gql`
    mutation CreateWithdrawal($input: WithdrawalInput!) {
  createWithdrawal(input: $input) {
    withdrawal {
      id
      title
      quantity
      endTime
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateWithdrawalMutationFn = Apollo.MutationFunction<CreateWithdrawalMutation, CreateWithdrawalMutationVariables>;

/**
 * __useCreateWithdrawalMutation__
 *
 * To run a mutation, you first call `useCreateWithdrawalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateWithdrawalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createWithdrawalMutation, { data, loading, error }] = useCreateWithdrawalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateWithdrawalMutation(baseOptions?: Apollo.MutationHookOptions<CreateWithdrawalMutation, CreateWithdrawalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateWithdrawalMutation, CreateWithdrawalMutationVariables>(CreateWithdrawalDocument, options);
      }
export type CreateWithdrawalMutationHookResult = ReturnType<typeof useCreateWithdrawalMutation>;
export type CreateWithdrawalMutationResult = Apollo.MutationResult<CreateWithdrawalMutation>;
export type CreateWithdrawalMutationOptions = Apollo.BaseMutationOptions<CreateWithdrawalMutation, CreateWithdrawalMutationVariables>;
export const DeleteWithdrawalDocument = gql`
    mutation DeleteWithdrawal($deleteWithdrawalId: Int!) {
  deleteWithdrawal(id: $deleteWithdrawalId)
}
    `;
export type DeleteWithdrawalMutationFn = Apollo.MutationFunction<DeleteWithdrawalMutation, DeleteWithdrawalMutationVariables>;

/**
 * __useDeleteWithdrawalMutation__
 *
 * To run a mutation, you first call `useDeleteWithdrawalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteWithdrawalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteWithdrawalMutation, { data, loading, error }] = useDeleteWithdrawalMutation({
 *   variables: {
 *      deleteWithdrawalId: // value for 'deleteWithdrawalId'
 *   },
 * });
 */
export function useDeleteWithdrawalMutation(baseOptions?: Apollo.MutationHookOptions<DeleteWithdrawalMutation, DeleteWithdrawalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteWithdrawalMutation, DeleteWithdrawalMutationVariables>(DeleteWithdrawalDocument, options);
      }
export type DeleteWithdrawalMutationHookResult = ReturnType<typeof useDeleteWithdrawalMutation>;
export type DeleteWithdrawalMutationResult = Apollo.MutationResult<DeleteWithdrawalMutation>;
export type DeleteWithdrawalMutationOptions = Apollo.BaseMutationOptions<DeleteWithdrawalMutation, DeleteWithdrawalMutationVariables>;
export const UpdateWithdrawalDocument = gql`
    mutation UpdateWithdrawal($input: WithdrawalUpdateInput!, $updateWithdrawalId: Int!) {
  updateWithdrawal(input: $input, id: $updateWithdrawalId) {
    withdrawal {
      id
      title
      quantity
      endTime
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type UpdateWithdrawalMutationFn = Apollo.MutationFunction<UpdateWithdrawalMutation, UpdateWithdrawalMutationVariables>;

/**
 * __useUpdateWithdrawalMutation__
 *
 * To run a mutation, you first call `useUpdateWithdrawalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateWithdrawalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateWithdrawalMutation, { data, loading, error }] = useUpdateWithdrawalMutation({
 *   variables: {
 *      input: // value for 'input'
 *      updateWithdrawalId: // value for 'updateWithdrawalId'
 *   },
 * });
 */
export function useUpdateWithdrawalMutation(baseOptions?: Apollo.MutationHookOptions<UpdateWithdrawalMutation, UpdateWithdrawalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateWithdrawalMutation, UpdateWithdrawalMutationVariables>(UpdateWithdrawalDocument, options);
      }
export type UpdateWithdrawalMutationHookResult = ReturnType<typeof useUpdateWithdrawalMutation>;
export type UpdateWithdrawalMutationResult = Apollo.MutationResult<UpdateWithdrawalMutation>;
export type UpdateWithdrawalMutationOptions = Apollo.BaseMutationOptions<UpdateWithdrawalMutation, UpdateWithdrawalMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    email
    username
    isAccess
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const IncomesDocument = gql`
    query Incomes($filters: IncomeFilters!) {
  incomes(filters: $filters) {
    id
    quantity
    price
    startTime
    createdAt
    product {
      id
      title
      description
      unitOfMeasurement
      materialType
    }
    supplier {
      id
      name
      ruc
      district
      province
      department
    }
  }
}
    `;

/**
 * __useIncomesQuery__
 *
 * To run a query within a React component, call `useIncomesQuery` and pass it any options that fit your needs.
 * When your component renders, `useIncomesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIncomesQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useIncomesQuery(baseOptions: Apollo.QueryHookOptions<IncomesQuery, IncomesQueryVariables> & ({ variables: IncomesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
      }
export function useIncomesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IncomesQuery, IncomesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
        }
export function useIncomesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<IncomesQuery, IncomesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<IncomesQuery, IncomesQueryVariables>(IncomesDocument, options);
        }
export type IncomesQueryHookResult = ReturnType<typeof useIncomesQuery>;
export type IncomesLazyQueryHookResult = ReturnType<typeof useIncomesLazyQuery>;
export type IncomesSuspenseQueryHookResult = ReturnType<typeof useIncomesSuspenseQuery>;
export type IncomesQueryResult = Apollo.QueryResult<IncomesQuery, IncomesQueryVariables>;
export const WithdrawalsDocument = gql`
    query Withdrawals($filters: WithdrawalFilters!) {
  withdrawals(filters: $filters) {
    id
    title
    quantity
    endTime
    createdAt
    product {
      id
      title
      description
      unitOfMeasurement
      materialType
    }
  }
}
    `;

/**
 * __useWithdrawalsQuery__
 *
 * To run a query within a React component, call `useWithdrawalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useWithdrawalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useWithdrawalsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useWithdrawalsQuery(baseOptions: Apollo.QueryHookOptions<WithdrawalsQuery, WithdrawalsQueryVariables> & ({ variables: WithdrawalsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<WithdrawalsQuery, WithdrawalsQueryVariables>(WithdrawalsDocument, options);
      }
export function useWithdrawalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<WithdrawalsQuery, WithdrawalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<WithdrawalsQuery, WithdrawalsQueryVariables>(WithdrawalsDocument, options);
        }
export function useWithdrawalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<WithdrawalsQuery, WithdrawalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<WithdrawalsQuery, WithdrawalsQueryVariables>(WithdrawalsDocument, options);
        }
export type WithdrawalsQueryHookResult = ReturnType<typeof useWithdrawalsQuery>;
export type WithdrawalsLazyQueryHookResult = ReturnType<typeof useWithdrawalsLazyQuery>;
export type WithdrawalsSuspenseQueryHookResult = ReturnType<typeof useWithdrawalsSuspenseQuery>;
export type WithdrawalsQueryResult = Apollo.QueryResult<WithdrawalsQuery, WithdrawalsQueryVariables>;
export const StockDocument = gql`
    query Stock($filters: StockFilters!) {
  stock(filters: $filters) {
    id
    title
    description
    unitOfMeasurement
    materialType
    totalStock
    averagePrice
    totalValue
    createdAt
  }
}
    `;

/**
 * __useStockQuery__
 *
 * To run a query within a React component, call `useStockQuery` and pass it any options that fit your needs.
 * When your component renders, `useStockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStockQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useStockQuery(baseOptions: Apollo.QueryHookOptions<StockQuery, StockQueryVariables> & ({ variables: StockQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StockQuery, StockQueryVariables>(StockDocument, options);
      }
export function useStockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StockQuery, StockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StockQuery, StockQueryVariables>(StockDocument, options);
        }
export function useStockSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<StockQuery, StockQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<StockQuery, StockQueryVariables>(StockDocument, options);
        }
export type StockQueryHookResult = ReturnType<typeof useStockQuery>;
export type StockLazyQueryHookResult = ReturnType<typeof useStockLazyQuery>;
export type StockSuspenseQueryHookResult = ReturnType<typeof useStockSuspenseQuery>;
export type StockQueryResult = Apollo.QueryResult<StockQuery, StockQueryVariables>;
export const CreateProductDocument = gql`
    mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    product {
      id
      title
      description
      unitOfMeasurement
      materialType
      createdAt
      updatedAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateProductMutationFn = Apollo.MutationFunction<CreateProductMutation, CreateProductMutationVariables>;

/**
 * __useCreateProductMutation__
 *
 * To run a mutation, you first call `useCreateProductMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateProductMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createProductMutation, { data, loading, error }] = useCreateProductMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateProductMutation(baseOptions?: Apollo.MutationHookOptions<CreateProductMutation, CreateProductMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateProductMutation, CreateProductMutationVariables>(CreateProductDocument, options);
      }
export type CreateProductMutationHookResult = ReturnType<typeof useCreateProductMutation>;
export type CreateProductMutationResult = Apollo.MutationResult<CreateProductMutation>;
export type CreateProductMutationOptions = Apollo.BaseMutationOptions<CreateProductMutation, CreateProductMutationVariables>;
export const ProductsDocument = gql`
    query Products {
  products {
    id
    title
    description
    unitOfMeasurement
    materialType
    createdAt
    updatedAt
    withdrawal {
      id
      title
      quantity
      endTime
      createdAt
      updatedAt
    }
    entry {
      id
      quantity
      price
      startTime
      createdAt
      updatedAt
      supplier {
        id
        name
        ruc
        district
        province
        department
        productCount
        createdAt
        updatedAt
      }
    }
  }
}
    `;

/**
 * __useProductsQuery__
 *
 * To run a query within a React component, call `useProductsQuery` and pass it any options that fit your needs.
 * When your component renders, `useProductsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useProductsQuery({
 *   variables: {
 *   },
 * });
 */
export function useProductsQuery(baseOptions?: Apollo.QueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
      }
export function useProductsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export function useProductsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<ProductsQuery, ProductsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<ProductsQuery, ProductsQueryVariables>(ProductsDocument, options);
        }
export type ProductsQueryHookResult = ReturnType<typeof useProductsQuery>;
export type ProductsLazyQueryHookResult = ReturnType<typeof useProductsLazyQuery>;
export type ProductsSuspenseQueryHookResult = ReturnType<typeof useProductsSuspenseQuery>;
export type ProductsQueryResult = Apollo.QueryResult<ProductsQuery, ProductsQueryVariables>;
export const SupplierDocument = gql`
    query Supplier($supplierId: Int!) {
  supplier(id: $supplierId) {
    id
    name
    ruc
    district
    province
    department
    productCount
    createdAt
    updatedAt
    entry {
      id
      product {
        id
        title
        description
        unitOfMeasurement
        materialType
        createdAt
        updatedAt
      }
      quantity
      price
      startTime
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useSupplierQuery__
 *
 * To run a query within a React component, call `useSupplierQuery` and pass it any options that fit your needs.
 * When your component renders, `useSupplierQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSupplierQuery({
 *   variables: {
 *      supplierId: // value for 'supplierId'
 *   },
 * });
 */
export function useSupplierQuery(baseOptions: Apollo.QueryHookOptions<SupplierQuery, SupplierQueryVariables> & ({ variables: SupplierQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
      }
export function useSupplierLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
        }
export function useSupplierSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SupplierQuery, SupplierQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SupplierQuery, SupplierQueryVariables>(SupplierDocument, options);
        }
export type SupplierQueryHookResult = ReturnType<typeof useSupplierQuery>;
export type SupplierLazyQueryHookResult = ReturnType<typeof useSupplierLazyQuery>;
export type SupplierSuspenseQueryHookResult = ReturnType<typeof useSupplierSuspenseQuery>;
export type SupplierQueryResult = Apollo.QueryResult<SupplierQuery, SupplierQueryVariables>;
export const SuppliersDocument = gql`
    query Suppliers {
  suppliers {
    id
    name
    ruc
    district
    province
    department
    productCount
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useSuppliersQuery__
 *
 * To run a query within a React component, call `useSuppliersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSuppliersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSuppliersQuery({
 *   variables: {
 *   },
 * });
 */
export function useSuppliersQuery(baseOptions?: Apollo.QueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
      }
export function useSuppliersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
        }
export function useSuppliersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SuppliersQuery, SuppliersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SuppliersQuery, SuppliersQueryVariables>(SuppliersDocument, options);
        }
export type SuppliersQueryHookResult = ReturnType<typeof useSuppliersQuery>;
export type SuppliersLazyQueryHookResult = ReturnType<typeof useSuppliersLazyQuery>;
export type SuppliersSuspenseQueryHookResult = ReturnType<typeof useSuppliersSuspenseQuery>;
export type SuppliersQueryResult = Apollo.QueryResult<SuppliersQuery, SuppliersQueryVariables>;