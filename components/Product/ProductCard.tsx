import CardEmpty from "@/components/CardEmpty";
import {
  filterProductsByEntry,
  getFilteredAndSortedProducts,
  getWithdrawalsFromProducts,
} from "@/func/product/productType";
import { MeQuery, useDeleteProductMutation } from "@/gen/gql";
import { Reference, StoreObject } from "@apollo/client";
import { useState } from "react";
import EntryCreate from "../Entry/EntryCreate";
import TagList from "../TagList";
import ItemWithdrawalCard from "../Withdrawal/ItemWithdrawalCard";
import WithdrawalCreate from "../Withdrawal/WithdrawalCreate";
import ItemProductoCard from "./ItemProductoCard";

type Product = {
  __typename?: "Product";
  id: number;
  title: string;
  description?: string | null;
  unitOfMeasurement: string;
  materialType: string;
  createdAt: any;
  updatedAt: any;
  withdrawal: Array<{
    __typename?: "Withdrawal";
    id: number;
    title?: string | null;
    quantity: number;
    endTime: any;
    createdAt: any;
    updatedAt: any;
  }>;
  entry: Array<{
    __typename?: "Entry";
    id: number;
    quantity: number;
    price: number;
    startTime: any;
    createdAt: any;
    updatedAt: any;
    supplier: {
      __typename?: "Supplier";
      id: number;
      name: string;
      ruc?: string | null;
      district?: string | null;
      province?: string | null;
      department?: string | null;
      productCount: number;
      createdAt: any;
      updatedAt: any;
    };
  }>;
};

type Props = {
  user: MeQuery;
  pathname: string;
  data: Product[];
};

const ProductCard = ({ pathname, data, user }: Props) => {
  const [deleteProduct] = useDeleteProductMutation();
  const [supplierId, setSupplier] = useState<number | null>(null);
  const [withdrawalId, setWithdrawal] = useState<number | null>(null);
  const onDelete = (id: number) => {
    deleteProduct({
      variables: { id },
      update: (cache) => {
        cache.modify({
          fields: {
            products(ctx = [], { readField }) {
              return ctx.filter(
                (ref: Reference | StoreObject | undefined) =>
                  id !== readField("id", ref),
              );
            },
          },
        });
      },
    });
  };

  const render = (data: Product[]) => {
    return data?.length === 0 ? (
      <CardEmpty title="Contenido de informes vacíos" />
    ) : (
      <div id="articles" className="flush-left bc-black-075 mx:ml0">
        {data?.map((q) => (
          <div key={q.id} className={"s-post-summary"}>
            <div className="s-post-summary--content w100">
              <div className="s-post-summary--content-title mb2 d-flex">
                <div className="s-link">{q.title}</div>
                <div
                  className="flex--item fl1 s-link ml8"
                  style={{ fontSize: "13.5px" }}
                >
                  Nro. {q.id}
                </div>
                {
                  <div className="d-flex">
                    <div
                      onClick={() => setSupplier(q.id)}
                      className="s-link s-user-card--link d-flex gs4"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        className="Octicon-sc-9kayk9-0"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"></path>
                      </svg>
                      <div className="flex--item -link">Proveedor</div>
                    </div>
                    <div
                      onClick={() => setWithdrawal(q.id)}
                      className="s-link s-user-card--link d-flex gs4 ml16"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        className="Octicon-sc-9kayk9-0"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path>
                      </svg>
                      <div className="flex--item -link">Salida</div>
                    </div>
                  </div>
                }
              </div>

              <EntryCreate
                handleClose={() => setSupplier(null)}
                isOpen={supplierId === q.id}
                product={q}
              />

              <WithdrawalCreate
                handleClose={() => setWithdrawal(null)}
                isOpen={withdrawalId === q.id}
                product={q}
              />
              <div className="d-flex">
                <div className="aside-cta flex--item">
                  <TagList tags={[q.materialType, q.unitOfMeasurement]} />
                </div>
              </div>
              <ItemProductoCard user={user!} entry={q.entry} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const withdrawal = (data: Product[]) => {
    return data?.reduce((total, product) => {
      return total + product.withdrawal.length;
    }, 0) === 0 ? (
      <CardEmpty title="Contenido de informes vacíos" />
    ) : (
      <div id="articles" className="flush-left bc-black-075 mx:ml0">
        {data.map((q) => (
          <div key={q.id} className={"s-post-summary"}>
            <div className="s-post-summary--content w100">
              <div className="s-post-summary--content-title mb2 d-flex">
                <div className="s-link">{q.title}</div>

                <div
                  className="flex__item fl1 s-link ml8"
                  style={{ fontSize: "13.5px" }}
                >
                  Nro. {q.id}
                </div>
                {
                  <div className="d-flex">
                    <div
                      onClick={() => setWithdrawal(q.id)}
                      className="s-link s-user-card--link d-flex gs4 ml16"
                    >
                      <svg
                        aria-hidden="true"
                        focusable="false"
                        role="img"
                        className="Octicon-sc-9kayk9-0"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path>
                      </svg>
                      <div className="flex--item -link">Salida</div>
                    </div>
                  </div>
                }
              </div>
              <WithdrawalCreate
                handleClose={() => setWithdrawal(null)}
                isOpen={withdrawalId === q.id}
                product={q}
              />
              <ItemWithdrawalCard user={user!} withdrawal={q.withdrawal} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  const all = (data: Product[]) => {
    return data?.length === 0 ? (
      <CardEmpty title="Contenido de informes vacíos" />
    ) : (
      <div id="articles" className="flush-left bc-black-075 mx:ml0">
        {data.map((q) => (
          <div key={q.id} className={"s-post-summary"}>
            <div className="s-post-summary--content w100">
              <div className="s-post-summary--content-title mb2 d-flex">
                <div
                // href={`/products/[productId]`}
                // as={`/products/${q.id}`}
                >
                  <a className="s-link">{q.title}</a>
                </div>

                <div
                  className="flex__item s-link ml8"
                  style={{ fontSize: "13.5px" }}
                >
                  Nro. {q.id}
                </div>
              </div>

              <div className="d-flex">
                <div className="flex--item fl1 ">
                  {q.description && (
                    <span className="fc-black-400 mr2">{q.description}</span>
                  )}
                </div>
                <div className="ml12 aside-cta flex--item">
                  <TagList tags={[q.materialType, q.unitOfMeasurement]} />
                </div>
              </div>

              <EntryCreate
                handleClose={() => setSupplier(null)}
                isOpen={supplierId === q.id}
                product={q}
              />

              {user.me != null && user.me != undefined && user.me.isAccess ? (
                <div className="s-post-summary--meta mt4">
                  <div
                    onClick={() => setSupplier(q.id)}
                    className="s-link s-user-card--link d-flex gs4 ml4"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      className="Octicon-sc-9kayk9-0"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"></path>
                    </svg>
                    <div className="flex--item -link">Proveedor</div>
                  </div>
                  <div className="s-user-card s-user-card__minimal">
                    <div className="s-link s-user-card--link d-flex gs4 ml4">
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        className="svg-icon iconTack d-block mx-auto"
                      >
                        <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
                      </svg>
                      <div
                        onClick={() => onDelete(q.id)}
                        className="flex--item -link"
                      >
                        Eliminar
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="s-post-summary--meta mt4">
                  <div
                    onClick={() => setSupplier(q.id)}
                    className="s-link s-user-card--link d-flex gs4 ml4"
                  >
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      role="img"
                      className="Octicon-sc-9kayk9-0"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="currentColor"
                    >
                      <path d="M1.75 16A1.75 1.75 0 0 1 0 14.25V1.75C0 .784.784 0 1.75 0h8.5C11.216 0 12 .784 12 1.75v12.5c0 .085-.006.168-.018.25h2.268a.25.25 0 0 0 .25-.25V8.285a.25.25 0 0 0-.111-.208l-1.055-.703a.749.749 0 1 1 .832-1.248l1.055.703c.487.325.779.871.779 1.456v5.965A1.75 1.75 0 0 1 14.25 16h-3.5a.766.766 0 0 1-.197-.026c-.099.017-.2.026-.303.026h-3a.75.75 0 0 1-.75-.75V14h-1v1.25a.75.75 0 0 1-.75.75Zm-.25-1.75c0 .138.112.25.25.25H4v-1.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v1.25h2.25a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5a.25.25 0 0 0-.25.25ZM3.75 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 3.75A.75.75 0 0 1 3.75 3h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 3.75Zm4 3A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 7 6.75ZM7.75 3h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5ZM3 9.75A.75.75 0 0 1 3.75 9h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 3 9.75ZM7.75 9h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 1 0-1.5Z"></path>
                    </svg>
                    <div className="flex--item -link">Proveedor</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const pathMap: Record<string, JSX.Element | JSX.Element[]> = {
    all: all(getFilteredAndSortedProducts({ data })),
    news: render(filterProductsByEntry({ data })),
    valid: withdrawal(getWithdrawalsFromProducts({ data })),
  };

  return pathMap[pathname] || pathMap.news;
};

export default ProductCard;
