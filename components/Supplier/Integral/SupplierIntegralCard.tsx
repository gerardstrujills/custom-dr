import CardEmpty from "@/components/CardEmpty";
import EntryUpdate from "@/components/Entry/EntryUpdate";
import ItemEntryCard from "@/components/Entry/ItemEntryCard";
import {
  MeQuery,
  SupplierDocument,
  SupplierQuery,
  useDeleteEntryMutation,
} from "@/gen/gql";
import { useState } from "react";

type Entry = {
  id: number;
  quantity: number;
  price: number;
  startTime: any;
  createdAt: any;
  updatedAt: any;
  product: {
    id: number;
    title: string;
    description?: string | null;
    unitOfMeasurement: string;
    materialType: string;
    createdAt: any;
    updatedAt: any;
  };
};

type Supplier = {
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

type Props = {
  user: MeQuery;
  pathname: string;
  supplier: Supplier;
  entry: Entry[];
};

const SupplierIntegralCard = ({ pathname, entry, supplier, user }: Props) => {
  const [deleteEntry] = useDeleteEntryMutation();
  const handleDelete = (id: number) => {
    deleteEntry({
      variables: { deleteEntryId: id },
      update: (cache) => {
        const existingData = cache.readQuery<SupplierQuery>({
          query: SupplierDocument,
          variables: {
            supplierId: supplier.id,
          },
        });

        const updatedEntries = existingData?.supplier?.entry.filter(
          (entry) => entry.id !== id,
        );

        cache.writeQuery({
          query: SupplierDocument,
          data: {
            supplier: {
              ...existingData?.supplier,
              entry: updatedEntries,
            },
          },
        });
      },
    });
  };

  const [supplierId, setSupplierId] = useState<number | null>(null);
  const render = (data: Entry[]) => {
    return data.length === 0 ? (
      <CardEmpty title="Contenido de informes vacíos" />
    ) : (
      <div id="articles" className="flush-left bc-black-075 mx:ml0">
        {data.map((q) => (
          <div key={q.id} className={"s-post-summary"}>
            <div className="s-post-summary--content w100">
              <div className="s-post-summary--content-title mb2 d-flex">
                <div>
                  <a className="s-link">{q.product.title}</a>
                </div>

                <div
                  className="flex__item s-link ml8"
                  style={{ fontSize: "13.5px" }}
                >
                  Nro. {q.id}
                </div>
              </div>
              <div className="my4">
                {q.product.description && (
                  <span className="fc-black-400">{q.product.description}</span>
                )}
              </div>
              <ItemEntryCard
                entry={[
                  {
                    id: q.id,
                    quantity: q.quantity,
                    price: q.price,
                    startTime: q.startTime,
                    createdAt: q.createdAt,
                    updatedAt: q.updatedAt,
                  },
                ]}
                design={{
                  isGrid: false,
                  isFlex: true,
                }}
              />

              <EntryUpdate
                handleClose={() => setSupplierId(null)}
                isOpen={supplierId === q.id}
                entry={{
                  id: q.id,
                  quantity: q.quantity,
                  price: q.price,
                  startTime: q.startTime,
                  createdAt: q.createdAt,
                  updatedAt: q.updatedAt,
                  supplier: {
                    id: supplier.id,
                    name: supplier.name,
                    ruc: supplier.ruc,
                    district: supplier.district,
                    province: supplier.province,
                    department: supplier.department,
                    productCount: supplier.productCount,
                    createdAt: supplier.createdAt,
                    updatedAt: supplier.updatedAt,
                  },
                }}
              />

              {user?.me?.isAccess && (
                <div className="s-post-summary--meta mt4">
                  <div className="s-user-card s-user-card__minimal">
                    <div
                      onClick={() => handleDelete(q.id)}
                      className="s-link s-user-card--link d-flex gs4 ml4"
                    >
                      <svg
                        height="16"
                        viewBox="0 0 16 16"
                        version="1.1"
                        width="16"
                        className="svg-icon iconTack d-block mx-auto"
                      >
                        <path d="M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z"></path>
                      </svg>
                      <div className="flex--item -link">Eliminar</div>
                    </div>
                    <div className="s-link s-user-card--link d-flex gs4 ml4">
                      <div
                        onClick={() => setSupplierId(q.id)}
                        className="s-user-card--link d-flex gs4 -link ml4"
                      >
                        <svg
                          aria-hidden="true"
                          height="16"
                          viewBox="0 0 16 16"
                          version="1.1"
                          width="16"
                          data-view-component="true"
                          className="svg-icon iconTack d-block mx-auto"
                        >
                          <path d="m.427 1.927 1.215 1.215a8.002 8.002 0 1 1-1.6 5.685.75.75 0 1 1 1.493-.154 6.5 6.5 0 1 0 1.18-4.458l1.358 1.358A.25.25 0 0 1 3.896 6H.25A.25.25 0 0 1 0 5.75V2.104a.25.25 0 0 1 .427-.177ZM7.75 4a.75.75 0 0 1 .75.75v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5A.75.75 0 0 1 7.75 4Z"></path>
                        </svg>
                        <div className="flex--item -link">Actualizar</div>
                      </div>
                    </div>
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
    news: render(entry),
  };

  return pathMap[pathname] || pathMap.news;
};

export default SupplierIntegralCard;
