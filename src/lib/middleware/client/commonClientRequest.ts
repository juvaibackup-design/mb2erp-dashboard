import Cookies from "js-cookie";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_URL}/`;

const clientPostApi = async (
  endPoint: string,
  option: any,
  onSuccess: any,
  onError: any
) => {
  //   const token = User.token;
  const token: any = Cookies.get("token");

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions: any = {
    headers: myHeaders,
  };

  requestOptions.method = "POST";
  requestOptions.body = JSON.stringify(option) || {};
  try {
    await fetch(`${BASE_URL}${endPoint}`, { ...requestOptions })
      .then((response) => response.json())
      .then((result) => {
        if (result?.code == 200 || result?.statusCode == 200) {
          onSuccess(result);
        } else {
          onError(result);
        }
      });
  } catch (error) {
    console.log("clientPostApi error", error);
  }
};

const clientGetApi = async (
  endPoint: string,
  option: any,
  onSuccess: any,
  onError: any
) => {
  //   const token = User.token;
  const token: any = Cookies.get("token");

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions: any = {
    headers: myHeaders,
  };

  requestOptions.method = "GET";
  try {
    await fetch(`${BASE_URL}${endPoint}`, { ...requestOptions })
      .then((response) => response.json())
      .then((result) => {
        console.log(
          "result",
          result,
          result?.code == 200 || result?.statusCode == 200 || result?.errorCode
        );
        if (
          result?.code == 200 ||
          result?.statusCode == 200 ||
          result?.errorCode == 200
        ) {
          onSuccess(result);
        } else {
          onError(result);
        }
      });
  } catch (error) {
    console.log("clientPostApi error", error);
    onError(error);
  }
};

const clientPutApi = async (
  endPoint: string,
  option: any,
  onSuccess: any,
  onError: any
) => {
  //   const token = User.token;
  const token: any = Cookies.get("token");

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  let requestOptions: any = {
    headers: myHeaders,
  };

  requestOptions.method = "PUT";
  try {
    await fetch(`${BASE_URL}${endPoint}`, { ...requestOptions })
      .then((response) => response.json())
      .then((result) => {
        if (result?.code == 200 || result?.statusCode == 200) {
          onSuccess(result);
        } else {
          onError(result);
        }
      });
  } catch (error) {
    console.log("clientPostApi error", error);
    onError(error);
  }
};

export { clientPostApi, clientGetApi, clientPutApi };
