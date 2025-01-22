import CommissioningPackage from "../types/CommissioningPackage.ts";

const BASE_URL = "http://localhost:8000";

const getRequestConfig = async (
  method: string,
  body: object | undefined = undefined,
): Promise<RequestInit> => {
  const requestConfig: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-CSRF": "1",
    },
    credentials: "include",
  };

  if (body) {
    requestConfig.body = JSON.stringify(body);
  }

  return requestConfig;
};

// COMMISSIONING PACKAGE

export const createCommissioningPackage = async (
  commissioningPackage: CommissioningPackage,
): Promise<CommissioningPackage> => {
  return commissioningPackage;
};

export const getCommissioningPackage = async (
  id: string,
): Promise<CommissioningPackage> => {
  const response = await fetch(`${BASE_URL}/commissioning-package/${id}`);
  return response.json();
};

export const getAllCommissioningPackages = async (): Promise<string[]> => {
  const response = await fetch(
    `${BASE_URL}/commissioning-package/get-all-commissioning-packages-ids`,
  );
  return response.json();
};

export const updateCommissioningPackage = async () => {};

export const deleteCommissioningPackage = async () => {};

// BOUNDARY
export const addBoundary = async (
  packageId: string,
  nodeId: string,
): Promise<string> => {
  console.log(
    `${BASE_URL}/commissioning-package/${packageId}/boundary/${nodeId}`,
  );
  const response = await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/boundary/${encodeURIComponent(nodeId)}`,
    { method: "POST" },
  );
  return response.json();
};

export const deleteBoundary = async (
  packageId: string,
  nodeId: string,
): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/boundary/${encodeURIComponent(nodeId)}`,
    { method: "DELETE" },
  );
  return response.json();
};

// INTERNAL
export const addInternal = async (
  packageId: string,
  nodeId: string,
): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/internal/${encodeURIComponent(nodeId)}`,
    { method: "POST" },
  );
  return response.json();
};

export const deleteInternal = async (
  packageId: string,
  nodeId: string,
): Promise<string> => {
  const response = await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/internal/${encodeURIComponent(nodeId)}`,
    { method: "DELETE" },
  );
  return response.json();
};
