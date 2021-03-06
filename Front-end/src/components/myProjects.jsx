import React, { Component } from "react";
import Swal from "sweetalert2";
import { deleteProject, getMyProjects } from "../services/projectService";
import { getCurrentUser, getFavorites } from "../services/userService";
import PageHeader from "./common/pageHeader";
import Project from "./project";
import { FavoritesContext } from "./context/favoritesContext";

class MyProjects extends Component {
  state = {
    user: "",
    data: [],
    errors: {},
  };
  static contextType = FavoritesContext; ///
  async componentDidMount() {
    let user = await getCurrentUser();
    this.setState({ user });
    const projects = await getMyProjects();
    this.setState({ data: projects.data });
    const [, setFavorite] = this.context; ///
    let favorites = await getFavorites();
    setFavorite(favorites.data); ///
  }

  deleteProject = (project) => {
    Swal.fire({
      title: "Are you sure you want to delete this card?",
      text:
        "You won't be able to revert this, the card will be delete forever!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProject(project);
        this.setState(({ data }) => {
          return {
            data: data.filter((datai) => datai !== project),
          };
        });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };
  render() {
    const { data, user } = this.state;
    const [favorites] = this.context; ///

    return (
      <div className="container-fluid">
        <PageHeader titleText="My Projects page" />
        <div className="row">
          <div className="col-12">
            <p className="h4 text-center">
              Here you can view all of your amazing projects
            </p>
          </div>
        </div>
        <div className="row">
          {data.length > 0 ? (
            data.map((project) => (
              <Project
                key={project._id}
                project={project}
                user={user}
                isFavorite={favorites?.some(
                  (favorite) => favorite["_id"] === project._id
                )} ///
                deleteProject={this.deleteProject}
              />
            ))
          ) : (
            <h2 className=" mt-4 p-4">No Self Project has found...</h2>
          )}
        </div>
      </div>
    );
  }
}

export default MyProjects;
