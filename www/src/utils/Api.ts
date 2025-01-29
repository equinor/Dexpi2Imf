import CommissioningPackage from "../types/CommissioningPackage.ts";

const BASE_URL = "http://localhost:8000";

async function request<TResponse>(
  url: string,
  requestInit: RequestInit,
): Promise<TResponse> {
  const response = await fetch(url, requestInit);
  if (response.ok) {
    if (response.status === 204) {
      return {} as TResponse;
    }

    return response.json();
  }
  // response not ok and not unauthorized
  const jsonError = await response.json();
  return Promise.reject(jsonError);
}

const getRequestConfig = async (
  method: string,
  body: object | undefined = undefined,
): Promise<RequestInit> => {
  const requestConfig: RequestInit = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    requestConfig.body = JSON.stringify(body);
  }

  return requestConfig;
};

// COMMISSIONING PACKAGE

export const createCommissioningPackage = async (
  commissioningPackage: CommissioningPackage,
): Promise<string> => {
  return await request(
    `${BASE_URL}/commissioning-package/`,
    await getRequestConfig("POST", commissioningPackage),
  );
};

export const getCommissioningPackage = async (
  id: string,
): Promise<CommissioningPackage> => {
  const response = await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(id)}`,
  );
  return response.json();
};

export const getAllCommissioningPackages = async (): Promise<
  CommissioningPackage[]
> => {
  const response = await fetch(`${BASE_URL}/commissioning-package/all`);
  return response.json();
};

export const updateCommissioningPackage = async () => {};

export const deleteCommissioningPackage = async (packageId: string) => {
  return await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}`,
    { method: "DELETE" },
  );
};

// BOUNDARY

export const updateBoundary = async (packageId: string, nodeId: string) => {
  return await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/update-boundary/${encodeURIComponent(nodeId)}`,
    { method: "POST" },
  );
};

// INTERNAL

export const updateInternal = async (packageId: string, nodeId: string) => {
  return await fetch(
    `${BASE_URL}/commissioning-package/${encodeURIComponent(packageId)}/update-internal/${encodeURIComponent(nodeId)}`,
    { method: "POST" },
  );
};
