import axios from "axios";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const { doRequest, loading, errors } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <p>Signing you out...</p>;
};

export default Signout;
