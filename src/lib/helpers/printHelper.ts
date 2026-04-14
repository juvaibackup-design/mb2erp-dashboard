import makeApiCall from "@/lib/helpers/apiHandlers/api";
import { useUserStore } from "@/store/userInfo/store";

// const userDetails = useUserStore((state: any)=> state.user ? JSON.parse(state.user):null);

export async function handlePrint(
  userDetails: any,
  currentForm: string,
  setPrintList: any,
  setIsPrintLayoutModalOpen: any
) {
  console.log("userDetails", userDetails);
  const { accessPrivilegeList } = userDetails;
  const selectedForm = accessPrivilegeList.filter((item: any) => {
    return item.form_name === currentForm;
  });

  try {
    const printListEndpoint = `GetPrintListForSelectedForm`;
    const printListPayload = {
      p_index: selectedForm?.[0]?.p_index,
      c_index: selectedForm?.[0]?.c_index,
      gc_index: selectedForm?.[0]?.gc_index,
    };

    const response = await makeApiCall.post(
      printListEndpoint,
      printListPayload
    );
    const { data } = response?.data;
    setPrintList(data);
    setTimeout(() => {
      setIsPrintLayoutModalOpen(true);
    }, 100);
  } catch (error) {
    console.log("printListEndpoint::error", error);
  }
}
