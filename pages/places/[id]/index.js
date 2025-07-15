import { useRouter } from "next/router";
import useSWR from "swr";
import styled from "styled-components";
import Comments from "../../../components/Comments";
import { StyledLink } from "../../../components/StyledLink";
import { StyledButton } from "../../../components/StyledButton";
import { StyledImage } from "../../../components/StyledImage";

const ImageContainer = styled.div`
  position: relative;
  height: 15rem;
`;

const ButtonContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;

  & > * {
    flex-grow: 1;
    text-align: center;
  }
`;

const StyledLocationLink = styled(StyledLink)`
  text-align: center;
  background-color: lightgray;
  color: black;
  border: none;
`;

export default function DetailsPage() {
  const router = useRouter();
  //Wait for the router to be ready, then get the id from the url
  const { isReady } = router;
  const { id } = router.query;

  const { data: place, isLoading, error } = useSWR(`/api/places/${id}`);

  if (!isReady || isLoading || error) return <h2>Loading...</h2>;

  //Gets called when user clicks the 'delete' button
  async function deletePlace() {
    
    //A confirmation dialog/modal for the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this place?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/places/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the place");
      }

      alert("Place deleted successfully!");

      //Imperative routing. Redirect user to homepage.
      router.push("/");
    } catch (error) {
      console.error("Error deleting place:", error);
      alert("Could not delete the place. Please try again.");
    }
  }

  return (
    <>
      <StyledLink href={"/"} $justifySelf="start">
        back
      </StyledLink>
      <ImageContainer>
        <StyledImage
          src={place.image}
          priority
          fill
          sizes="(max-width: 768px) 100vw,
              (max-width: 1200px) 50vw,
              33vw"
          alt=""
        />
      </ImageContainer>
      <h2>
        {place.name}, {place.location}
      </h2>
      <StyledLocationLink href={place.mapURL}>
        Location on Google Maps
      </StyledLocationLink>
      <p>{place.description}</p>
      <ButtonContainer>
        <StyledLink href={`/places/${id}/edit`}>Edit</StyledLink>
        <StyledButton onClick={deletePlace} type="button" $variant="delete">
          Delete
        </StyledButton>
      </ButtonContainer>
    </>
  );
}
