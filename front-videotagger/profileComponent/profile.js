class Profile extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <body>
        <div class="text-center pt-5">
          <div class="d-flex justify-content-center">
            <img id="image" class="rounded-5 img-thumbnail" alt="Imagen no encontrada" />
            <h1 id="name"></h1>
            <a id="logout" class="m-lg-3" style="cursor: pointer">Cerrar Sesión</a>
          </div>
          <label for="txtCajita">Buscar una palabra:</label>
          <input type="text" id="txtCajita" />
          <button class="btn btn-outline-primary" id="videos">Obtener videos de Drive</button>
          <button class="btn btn-outline-success" id="video-db">Videos etiquetados</button>
          <div id="app" class="mx-auto w-75 p-3"></div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha2/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-qKXV1j0HvMUeCBQ+QVp7JcfGl760yU08IQ+GpUo5hlbpg51QRiuqHAJz8+BrxE/N"
          crossorigin="anonymous"></script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.min.js"></script>
      </body>
    `;
    const url = window.location.href;
    const regex = /([^&=]+)=([^&]*)/g;
    const urlWithoutHtml = window.location.origin;
    const params = {};
    let m;
    while ((m = regex.exec(location.href))) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }
    if (Object.keys(params).length) {
      localStorage.setItem("authInfo", JSON.stringify(params));
    }

    let info = JSON.parse(localStorage.getItem("authInfo"));
    let email = "";

    async function fetchUserData() {
      try {
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${info["access_token"]}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();

        console.log(data);

        email = data.email;

        document.getElementById("name").innerHTML += data.name;
        document.getElementById("image").setAttribute("src", data.picture);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }

    fetchUserData();

    const logoutBtn = document.querySelector("#logout");
    logoutBtn.addEventListener("click", logout);

    async function logout() {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${info["access_token"]}`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/x-www-form-urlencoded",
            },
          }
        );
        localStorage.removeItem("authInfo");
        location.href = `${urlWithoutHtml}/index.html`;
      } catch (error) {
        console.error(error);
      }
    }

    const videos = document.querySelector("#videos");
    const videoDb = document.querySelector("#video-db");
    let result = document.querySelector("#result");
    const app = document.querySelector("#app");
    const ACCESS_TOKEN = info["access_token"];

    function addVideoButtonEventListeners() {
      const videoButtons = document.querySelectorAll(".btn-primary");
      videoButtons.forEach((button) => {
        button.addEventListener("click", function () {
          const parentRow = this.closest("tr");
          const id = parentRow
            .querySelector(".drive-link")
            .getAttribute("data-id");
          const name = parentRow.querySelector(".drive-link").textContent;
          setVideo(urlWithoutHtml, id, name);
        });
      });
    }

    // Check if there is session storage
    //   if (sessionStorage.getItem("gDriveFiles")) {
    //     const files = JSON.parse(sessionStorage.getItem("gDriveFiles"));
    //     app.innerHTML = `
    //   <table class="table table-hover">
    //     <thead>
    //       <tr>
    //         <th scope="col"></th>
    //         <th scope="col"></th>
    //       </tr>
    //     </thead>
    //     <tbody id="result"></tbody>
    //   </table>
    // `;
    //     result = document.querySelector("#result");
    //     files.forEach((file) => {
    //       result.innerHTML += `
    //     <tr>
    //       <th scope="row">${file.name}</th>
    //       <td><a target="_blank" href="https://drive.google.com/file/d/${file.id}">${file.name}</a></td>
    //       <td><button class="btn btn-primary" onclick="setVideo('${urlWithoutHtml}', '${file.id}', '${file.name}')">Ver</button></td>
    //     </tr>
    //   `;
    //     });
    //   }

    function searchFiles(q = "") {
      app.innerHTML = "";

      fetch(
        `https://www.googleapis.com/drive/v3/files?q=${q}&pageSize=50&supportsAllDrives=true&fields=files(name,id,mimeType)`,
        {
          method: "GET",
          headers: new Headers({ Authorization: "Bearer " + ACCESS_TOKEN }),
        }
      )
        .then((res) => res.json())
        .then(({ files: valFiles }) => {
          videos.removeAttribute("disabled", "");
          app.innerHTML = `
        <table class="table table-hover">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="result"></tbody>
        </table>
      `;
          const result = document.querySelector("#result");

          // save in session storage
          sessionStorage.setItem("gDriveFiles", JSON.stringify(valFiles));

          //   valFiles.forEach(({ id, name }) => {
          //     result.innerHTML += `
          //   <tr>
          //     <th scope="row">${name}</th>
          //     <td>
          //       <a target="_blank" href="https://drive.google.com/file/d/${id}">${name}</a>
          //     </td>
          //     <td>
          //       <button class="btn btn-primary" onclick="setVideo('${urlWithoutHtml}', '${id}', '${name}')">Ver</button>
          //     </td>
          //   </tr>
          // `;
          //   });
          valFiles.forEach(({ id, name }) => {
            result.innerHTML += `
            <tr>
              <th scope="row">${name}</th>
              <td>
                <a class="drive-link" data-id="${id}" target="_blank" href="https://drive.google.com/file/d/${id}">${name}</a>
              </td>
              <td>
                <button class="btn btn-primary">Ver</button>
              </td>
            </tr>
          `;
          });
          addVideoButtonEventListeners(); // Agregar eventos a los botones Ver
        });
    }

    function getVideos() {
      searchFiles("mimeType contains 'video/'");
      videos.setAttribute("disabled", "");
      app.innerHTML = `
    <div class="d-flex justify-content-center">
      <div class="spinner-border text-primary" role="status">
      </div>
    </div>
  `;
    }

    function setVideo(url, id, fileName, userName) {
      // let views = 0;
      // if (!userName) {
      //   fetch(
      //     `https://stunning-capybara-1efe1a.netlify.app/.netlify/functions/api/users/`
      //   )
      //     .then((res) => res.json())
      //     .then(({ data }) => {
      //       const user = data.find((user) => user.email === email);
      //       if (user) userName = user.name;
      //       setVideo(url, id, fileName, userName);
      //     });
      //   return;
      // }
      // increase a view in videos
      // fetch(
      //   `https://stunning-capybara-1efe1a.netlify.app/.netlify/functions/api/videos/${id}`,
      //   {
      //     method: "PUT",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({}),
      //   }
      // )
      //   .then((res) => res.json())
      //   .then(({ data }) => {
      //     if (!data) {
      //       data = [
      //         {
      //           views: 0,
      //         },
      //       ];
      //     }
      //   views = data[0].views;
      localStorage.setItem(
        "videoInfo",
        JSON.stringify({
          name: fileName,
          email,
          user_name: userName,
        })
      );
      location.href = `${url}/player.html?id=${id}`;
      // });
      // location.href = `${url}/player.html?id=${id}`;
    }

    function getVideosDB() {
      app.innerHTML = `
        <div class="d-flex justify-content-center">
          <div class="spinner-border text-primary" role="status">
          </div>
        </div>
      `;
      fetch("http://localhost:3001/api/video")
        .then((res) => res.json())
        .then(({ data }) => {
          console.log(data);
          app.innerHTML = `
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Nombre</th>
                  <th scope="col">Drive</th>
                  <th scope="col">Subido por</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody id="result"></tbody>
            </table>
          `;
          const result = document.querySelector("#result");
          // data.forEach(({ title, url, user_name }) => {
          console.log(data);
          data.forEach(({ artifactLocation }) => {
            const row = document.createElement("tr");
            row.innerHTML = `
              <th scope="row">${"Titulo"}</th>
              <td><a target="_blank" href="https://drive.google.com/file/d/${artifactLocation}">${
              "Title" || artifactLocation
            }</a></td>
              <td>
                <p>${"Username"}</p>
              </td>
              <td>
                <button class="btn btn-primary" data-id="${artifactLocation}" data-name="${"Title"}" data-username="${"UserName"}">Ver</button>
              </td>
            `;
            result.appendChild(row);
          });

          result.addEventListener("click", function (event) {
            if (event.target.classList.contains("btn-primary")) {
              const id = event.target.getAttribute("data-id");
              const name = event.target.getAttribute("data-name");
              setVideo(urlWithoutHtml, id, name);
            }
          });
        });
    }

    videos.addEventListener("click", getVideos);
    videoDb.addEventListener("click", getVideosDB);
  }
}
window.customElements.define("profile-component", Profile);
