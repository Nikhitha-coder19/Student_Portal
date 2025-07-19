document.addEventListener("DOMContentLoaded", function () {

  const currentPage = window.location.pathname;
  if (!localStorage.getItem("isLoggedIn") && !currentPage.includes("login")) {
    window.location.href = "login.html";
  }

  let loginButton=document.getElementById("loginButton");
  let username=document.getElementById("username");
  let password=document.getElementById("password");
  let requirename=document.getElementById("usernameRequired");
  let requirepass=document.getElementById("passwordRequired");
  if (loginButton) {
    loginButton.addEventListener("click", function () {
      if (username.value === "" && password.value === "") {
        requirename.textContent = "*Required";
        requirepass.textContent = "*Required";
        requirename.style.color = "red";
        requirepass.style.color = "red";
      } else if (username.value === "") {
        requirename.textContent = "*Required";
        requirename.style.color = "red";
        requirepass.textContent = "";
      } else if (password.value === "") {
        requirepass.textContent = "*Required";
        requirepass.style.color = "red";
        requirename.textContent = "";
      } else {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username.value);
        window.location.href = "homePage.html";
      }
    });
  }

  // ✅ Home Page
  if (document.getElementById("studentList")) {
    loadStudents();
  }

  let addForm=document.getElementById("addDetails");
  if (addForm) {
    addForm.addEventListener("click", function () {
      localStorage.setItem("formMode", "add");
      window.location.href = "newForm.html";
    });
  }

  let backBtn = document.getElementById("backBtn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "homePage.html";
    });
  }

  if (currentPage.includes("newForm.html")) {
    const formTitle = document.getElementById("form-title");
    const btnText = document.getElementById("submit");
    const nameInp = document.getElementById("inputName");
    const numberInp = document.getElementById("inputNumber");
    const addressInp = document.getElementById("inputAddress");
    const branchInp = document.getElementById("inputBranch");
    const fillForm = document.getElementById("add-form");
    const success = document.getElementById("success");
    let nameErr=document.getElementById("name");
    let numberErr=document.getElementById("admissionNumber");
    let addressErr=document.getElementById("address");
    let branchErr=document.getElementById("branch");

    let isEditing = false;
    let editingId = null;
    nameInp.addEventListener("blur",function(){
    if(nameInp.value===""){
        nameErr.textContent="*Required";
        nameErr.style.color="red";
    }
    else{
        nameErr.textContent="";
    }
    })
    numberInp.addEventListener("blur",function(){
    if(numberInp.value===""){
        numberErr.textContent="*Required";
        numberErr.style.color="red";
    }
    else{
        numberErr.textContent="";
    }
    })
    addressInp.addEventListener("blur",function(){
    if(addressInp.value===""){
        addressErr.textContent="*Required";
        addressErr.style.color="red";
    }
    else{
        addressErr.textContent="";
    }
    })
    branchInp.addEventListener("blur",function(){
    if(branchInp.value===""){
        branchErr.textContent="*Required";
        branchErr.style.color="red";
    }
    else{
        branchErr.textContent="";
    }
    })

    if (localStorage.getItem("formMode") === "edit") {
      formTitle.textContent = "Edit Student Details";
      btnText.textContent = "Update";

      const student = JSON.parse(localStorage.getItem("studentToEdit"));
      if (student) {
        nameInp.value = student.name;
        numberInp.value = student.admissionNumber;
        addressInp.value = student.address;
        branchInp.value = student.branch;
        isEditing = true;
        editingId = student._id;
      }
    } else {
      formTitle.textContent = "Enter Student Details";
      btnText.textContent = "Submit";
    }

    fillForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      if(nameInp.value!=="" && numberInp.value!=="" && addressInp.value!=="" && branchInp.value!==""){
      const name = nameInp.value;
      const admissionNumber = numberInp.value;
      const address = addressInp.value;
      const branch = branchInp.value;

      if (name && admissionNumber && address && branch) {
        let url = "http://localhost:3000/students";
        let method = "POST";
        let successText = "Student Added Successfully";

        if (isEditing && editingId) {
          url = `http://localhost:3000/students/${editingId}`;
          method = "PUT";
          successText = "Student Updated Successfully";
        }

        const response = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, admissionNumber, address, branch })
        });

        await response.json();
        success.textContent = successText;
        success.style.display = "block";

        setTimeout(() => {
          success.style.display = "none";
          if (method === "POST") {
            window.location.href = "homePage.html";
          }
        }, 3000);
      }
      }
    });
  }

  if (currentPage.includes("studentDetails.html")) {
    const student = JSON.parse(localStorage.getItem("studentDetails"));
    if (student) {
      document.getElementById("sname").textContent = `Name: ${student.name}`;
      document.getElementById("sadmission").textContent = `Admission No.: ${student.admissionNumber}`;
      document.getElementById("saddress").textContent = `Address: ${student.address}`;
      document.getElementById("sbranch").textContent = `Branch: ${student.branch}`;
    }

    const backBtnDetails = document.getElementById("backBtndetails");
    if (backBtnDetails) {
      backBtnDetails.addEventListener("click", () => {
        window.location.href = "homePage.html";
      });
    }
  }

  async function loadStudents() {
    const list = document.getElementById("studentList");
    if (!list) return;

    const response = await fetch("http://localhost:3000/students");
    const students = await response.json();
    while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

    students.forEach(student => {
      const strip = document.createElement("div");
      strip.style.display = "flex";
      strip.style.justifyContent = "space-between";
      strip.style.alignItems = "center";
      strip.style.padding = "8px";
      strip.style.border = "1px solid #ccc";
      strip.style.borderRadius = "5px";
      strip.style.marginTop = "3px";
      strip.style.backgroundColor = "#f9f9f9";

      const name = document.createElement("span");
      name.textContent = student.name;
      name.style.cursor = "pointer";
      name.addEventListener("click", () => {
        localStorage.setItem("studentDetails", JSON.stringify(student));
        window.location.href = "studentDetails.html";
      });

      const btnGroup = document.createElement("div");

      let showBtn = document.createElement("button");
      showBtn.textContent = "Marks";
      showBtn.addEventListener("click", () => {
        localStorage.setItem("currentStudentId", student._id);
        window.location.href = "marksPage.html";
      });

      let editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.style.margin = "0 5px";
      editBtn.addEventListener("click", function () {
        localStorage.setItem("formMode", "edit");
        localStorage.setItem("studentToEdit", JSON.stringify(student));
        window.location.href = "newForm.html";
      });

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", async function () {
        const confirmed = confirm("Are you sure you want to delete this student?");
        if (!confirmed) return;
        await fetch(`http://localhost:3000/students/${student._id}/delete`, { method: "PUT" });
        loadStudents();
      });

      btnGroup.append(showBtn, editBtn, delBtn);
      strip.append(name, btnGroup);
      list.appendChild(strip);
    });
  }

});

