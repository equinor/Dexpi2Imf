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

const addParametersToUrl = (url: string, o: object): string => {
  const newUrl = new URL(url);
  const json = JSON.parse(JSON.stringify(o));
  for (const [key, value] of Object.entries(json)) {
    newUrl.searchParams.append(key, value as string);
  }
  return newUrl.toString();
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
