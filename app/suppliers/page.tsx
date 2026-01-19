"use client";

import { withApollo } from "@/apollo/withApollo";
import Container from "@/components/Container";
import Loading from "@/components/Loading";
import SupplierCreate from "@/components/Supplier/SupplierCreate";
import SupplierSearch from "@/components/Supplier/SupplierSearch";
import { useMeQuery, useSuppliersQuery } from "@/gen/gql";
import { useRouter } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

type SuppliersPageProps = {};

const SuppliersPage: React.FC<SuppliersPageProps> = () => {
  const { data, error, loading, refetch } = useSuppliersQuery();
  const { data: user, refetch: userFetch } = useMeQuery();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    if (!loading && error?.message === "not authenticated") {
      router.push("/");
    }

    refetch();
    userFetch();
  }, [loading, error, router, refetch, userFetch]);

  if (!loading && !data) {
    return (
      <Container user={user!} className="d-flex jc-center ai-center">
        <Loading />
      </Container>
    );
  }

  return (
    <Suspense fallback={<Loading />}>
      <Container user={user!}>
        <div id="mainbar-full">
          <div className="d-flex mb24">
            <div className="flex--item fl1">
              <h1 className="fs-headline mb0">Departamento de Proveedores</h1>
              <p className="fs-body1 fc-light fl-grow1 mb0">
                Todos los proveedores
              </p>
            </div>
            {
              <div className="ml12 aside-cta flex--item print:d-none">
                <button
                  onClick={() => setOpenModal(true)}
                  className="ws-nowrap s-btn s-btn__primary s-btn__sm d-flex p6"
                >
                  <svg
                    aria-hidden="true"
                    className="svg-icon iconPencil mr2"
                    width="14"
                    height="14"
                    viewBox="0 0 15 15"
                  >
                    <path d="M7.75 2a.75.75 0 0 1 .75.75V7h4.25a.75.75 0 0 1 0 1.5H8.5v4.25a.75.75 0 0 1-1.5 0V8.5H2.75a.75.75 0 0 1 0-1.5H7V2.75A.75.75 0 0 1 7.75 2Z"></path>
                  </svg>
                  <div className="flex__item">Crear Proveedor</div>
                </button>
              </div>
            }
          </div>

          <SupplierCreate
            handleClose={() => setOpenModal(false)}
            isOpen={openModal}
          />

          <SupplierSearch user={user!} data={data!} loading={loading} />
        </div>
      </Container>
    </Suspense>
  );
};

export default withApollo({ ssr: false })(SuppliersPage);
