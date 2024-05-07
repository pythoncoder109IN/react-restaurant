import { useNavigate, useParams } from "react-router-dom";
import useHttp from "../hooks/useHttp";
import Error from "./Error";
import Button from "./UI/Button";
import Paginate from "./Paginate";

const requestConfig = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { dishName } = useParams();
  const url = `https://api.edamam.com/api/food-database/v2/parser?ingr=${dishName}&app_id=${
    import.meta.env.VITE_APP_ID
  }&app_key=${import.meta.env.VITE_APP_KEY}`;
  const { data, isLoading, error } = useHttp(url, requestConfig, []);

  let loadedMeals = [];

  if (isLoading) {
    return <p className="center">Fetching meals...</p>;
  } else {
    loadedMeals = data.hints || [];
  }

  if (error) {
    return <Error title="Failed to fetch meals" message={error} />;
  }

  return (
    <>
      <Button textOnly className="control-center" onClick={() => navigate("/")}>
        Back to Homepage
      </Button>
      <Paginate items={loadedMeals} itemsPerPage={6} />
    </>
  );
}
