import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
  const navigate = useNavigate();
  function handleSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const customerData = Object.fromEntries(fd.entries());
    
    if (customerData.search.trim() === '') {
      return;
    }

    navigate(`/search/${customerData.search}`);
  }

  return (
    <form className="control-row" onSubmit={handleSubmit}>
      <Input id="search" placeholder="Search for an Item..." />
      <Button textOnly>Search</Button>
    </form>
  );
}
