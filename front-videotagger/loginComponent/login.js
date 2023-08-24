class Login extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.innerHTML = `
      <div class="d-flex align-items-center" style="min-height: 100vh">
        <div class="box w-100 text-success">
          <div class="container">
            <div class="row">
              <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
                <div class="card border-0 shadow rounded-3 my-5">
                  <div class="card-body text-center">
                    <h3>Inicio de sesión</h3>
                    <hr />
                    <button id="login-google" class="btn btn-primary p-2">
                    <i class="bi bi-google"></i> Iniciar sesión con <b>GOOGLE</b>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const loginbtn = this.querySelector("#login-google");
    loginbtn.addEventListener("click", signIn);
    function signIn() {
      const oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

      const form = document.createElement("form");
      form.setAttribute("method", "GET");
      form.setAttribute("action", oauth2Endpoint);

      const url = window.location.href;
      const urlWithoutHtml = url.substring(0, url.lastIndexOf("/"));

      const params = {
        client_id:
          "601367704101-0h4nc876bgfve25ar3khur78e5ggespp.apps.googleusercontent.com",
        redirect_uri: `${urlWithoutHtml}/profile.html`,
        response_type: "token",
        scope:
          "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.email",
        include_granted_scopes: "true",
        state: "pass-through value",
      };

      for (let p in params) {
        let input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", p);
        input.setAttribute("value", params[p]);
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    }
  }
}
window.customElements.define("login-component", Login);
