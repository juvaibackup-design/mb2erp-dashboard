// export const getUniqueColumnValues = (
//   columnKey: string,
//   filteredData: any[]
// ) => {
//   const uniqueValues = new Set(
//     filteredData?.map((item: any) => item[columnKey])
//   );
//   console.log("uniqueValues", uniqueValues);
//   return Array.from(uniqueValues);
// };

import { formateDateDependLoggedUser } from "./utilityHelpers";

export const getUniqueColumnValues = (
  columnKey: string,
  filteredData: any[] = []
) => {
  if (filteredData.length === 0) return [];
  const uniqueValues = new Set(
    filteredData
      ?.filter(
        (item: any) => item[columnKey] !== null && item[columnKey] !== ""
      )
      .map((item: any) => {
        if (columnKey == "pi_date") {
          return formateDateDependLoggedUser(item[columnKey]);
        }

        return item[columnKey];
      })
  );
  return Array.from(uniqueValues);
};

export const searchFunctionality = (value: string, data: any[]) => {
  const filteredArray = data?.filter((item: any) => {
    const found = Object.keys(item).some((key) => {
      const itemValue = `${item[key]}`;
      return (
        itemValue.toLowerCase().includes(value?.toLowerCase()) ||
        itemValue.toUpperCase().includes(value?.toUpperCase())
      );
    });

    return found;
  });

  return filteredArray;
};

// Filter single ID
export const filterListById = (
  list: any[] = [],
  listLabel: string,
  givenId: any
) => {
  return new Promise((resolve, reject) => {
    try {
      const filteredList = list.filter((item) => item[listLabel] == givenId);
      resolve(filteredList);
    } catch (error) {
      reject(error);
    }
  });
};

// Filter multiple ID
export const filterListByIds = (list = [], listLabel: string, givenIds: []) => {
  return new Promise((resolve, reject) => {
    try {
      const filteredList = list.filter((item) =>
        givenIds.includes(item[listLabel])
      );
      resolve(filteredList);
    } catch (error) {
      reject(error);
    }
  });
};
