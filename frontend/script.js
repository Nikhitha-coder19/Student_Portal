document.addEventListener("DOMContentLoaded",function(){
  let currentPage=window.location.pathname;
  if (!localStorage.getItem("isLoggedIn") && !currentPage.includes("login")) {
    window.location.href = "login.html";
  }

  //Login Page
  let loginButton=document.getElementById("loginButton");
  let username=document.getElementById("username");
  let password=document.getElementById("password");
  let requirename=document.getElementById("usernameRequired");
  let requirepass=document.getElementById("passwordRequired");
  if(loginButton){
    loginButton.addEventListener("click",function(){
        if(username.value==="" && password.value===""){
            requirename.textContent="*Required";
            requirepass.textContent="*Required";
            requirename.style.color="red";
            requirepass.style.color="red";
        }
        else if(username.value==="" && password.value!==""){
            requirename.textContent="*Required";
            requirepass.textContent="";
            requirename.style.color="red";
        }
        else if(username.value!=="" && password.value===""){
            requirename.textContent="";
            requirepass.textContent="*Required";
            requirepass.style.color="red";
        }
        else{
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "homePage.html";
        }
    })
  }

  //Home Page
  if(currentPage.includes("homePage.html")){
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
    async function loadStudents() {
      let response = await fetch("http://localhost:3000/students");
      let students = await response.json();
      const list = document.getElementById("studentList");
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
        strip.style.marginTop="3px";
        strip.style.backgroundColor = "#f9f9f9";

        const name = document.createElement("span");
        name.textContent = student.name;
        name.style.cursor = "pointer";
        name.addEventListener("click", () => {
          localStorage.setItem("studentDetails", JSON.stringify(student));
          window.location.href = "studentDetails.html";
        });

        let actionsGroup=document.createElement("div");

        let show=document.createElement("button");
        show.classList.add("actionsBtn","btn-show");
        show.textContent="Marks";
        show.style.fontSize="10px";
        show.addEventListener("click", () => {
          localStorage.setItem("currentStudentId", student._id);
          window.location.href = "marksPage.html";
        });

        let edit=document.createElement("button");
        edit.classList.add("actionsBtn","btn-edit");
        edit.textContent="Edit";
        edit.style.fontSize="10px";
        edit.style.marginLeft="3px";
        edit.style.marginRight="3px";
        edit.addEventListener("click", function () {
          localStorage.setItem("formMode", "edit");
          localStorage.setItem("studentToEdit", JSON.stringify(student));
          window.location.href = "newForm.html";
        });

        let del=document.createElement("button");
        del.classList.add("actionsBtn","btn-del");
        del.style.fontSize="10px";
        del.textContent="Delete";
        del.addEventListener("click", async function () {
          const confirmed = confirm("Are you sure you want to delete this student?");
          if (!confirmed) return;
          await fetch(`http://localhost:3000/students/${student._id}/delete`, { method: "PUT" });
          loadStudents();
        });

        actionsGroup.append(show,edit,del);
        strip.append(name,actionsGroup);
        strip.classList.add("row");
        list.appendChild(strip);
      });
    }
  }

  //Details Form
  if(currentPage.includes("newForm.html")){
    let title=document.getElementById("form-title");
    let btn=document.getElementById("submit");
    let success=document.getElementById("success");
    let fillForm=document.getElementById("add-form");
    let isEditing = false;
    let editingId = null;
    let nameErr=document.getElementById("name");
    let numberErr=document.getElementById("admissionNumber");
    let addressErr=document.getElementById("address");
    let branchErr=document.getElementById("branch");
    let nameInp=document.getElementById("inputName");
    let numberInp=document.getElementById("inputNumber");
    let addressInp=document.getElementById("inputAddress");
    let branchInp=document.getElementById("inputBranch");
    let backBtn = document.getElementById("backBtn");
    if (backBtn) {
      backBtn.addEventListener("click", function () {
      window.location.href = "homePage.html";
    });
    }
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
    if (localStorage.getItem("formMode") === "add") {
      title.textContent="Enter Student Details";
      btn.textContent="Submit";
    }
    else{
      title.textContent = "Edit Student Details";
      btn.textContent = "Update";
      let student = JSON.parse(localStorage.getItem("studentToEdit"));
      if (student) {
        nameInp.value = student.name;
        numberInp.value = student.admissionNumber;
        addressInp.value = student.address;
        branchInp.value = student.branch;
        isEditing = true;
        editingId = student._id;
      }
    }
    fillForm.addEventListener("submit",async(event)=>{
      event.preventDefault();
      if(nameInp.value!=="" && numberInp.value!=="" && addressInp.value!=="" && branchInp.value!==""){
          let name=nameInp.value;
          let admissionNumber=numberInp.value;
          let address=addressInp.value;
          let branch=branchInp.value;
          let data={name,
                  admissionNumber,
                  address,
                  branch};
          let url="http://localhost:3000/students";
          let method="POST";
          let successText="Student Added Successfully";
          if(isEditing && editingId){
              url=`http://localhost:3000/students/${editingId}`;
              method="PUT";
              successText="Student Details Updated Successfully";
          }
          const response=await fetch(url,{
              method,
              headers:{
                  "Content-Type":"application/json",
              },
              body:JSON.stringify(data)
          });
          const result=await response.json();
          console.log("Server Response:",result);
          success.textContent=successText;
          success.style.display="block";
          fillForm.reset();
          isEditing = false;
          editingId = null;
          setTimeout(()=>{
              success.style.display="none";
          },3000);
          //Back to Home Page after adding student
          if(method==="POST"){
            window.location.href = "homePage.html";   
          }
      }
    });
  }

  //Student Details Page
  if(currentPage.includes("studentDetails.html")){
    let student = JSON.parse(localStorage.getItem("studentDetails"));
    if (student) {
      document.getElementById("sname").textContent = `${student.name}`;
      document.getElementById("sadmission").textContent = `${student.admissionNumber}`;
      document.getElementById("saddress").textContent = `${student.address}`;
      document.getElementById("sbranch").textContent = `${student.branch}`;
    }
    let backDetails = document.getElementById("backBtndetails");
    if (backDetails) {
      backDetails.addEventListener("click", () => {
        window.location.href = "homePage.html";
      });
    }
  }

  //Marks Page
  if(currentPage.includes("marksPage.html")){
    let currentStudentId=localStorage.getItem("currentStudentId");
    fetch(`http://localhost:3000/grades/${currentStudentId}`)
    .then(res => res.json())
    .then(data => {
    if (data.length > 0) {
      // Disable the Add Marks button if marks already exist
      document.getElementById("addMarks").disabled = true;
      document.getElementById("addMarks").textContent = "Marks Already Added";
    } else {
      document.getElementById("addMarks").disabled = false;
      document.getElementById("addMarks").textContent = "Add Marks";
    }
    });
    if (document.getElementById("marksList")) {
      loadMarks(currentStudentId);
    }
    let backMarks=document.getElementById("backBtnmarks");
    if(backMarks){
      backMarks.addEventListener("click",()=>{
        window.location.href = "homePage.html";
      })
    }
    let addMarks=document.getElementById("addMarks");
    if (addMarks) {
    addMarks.addEventListener("click", function () {
      localStorage.setItem("marksMode", "add");
      localStorage.setItem("currentStudentId", currentStudentId);
      window.location.href = "marksForm.html";
    });
    }
    let updateMarks=document.getElementById("updateMarks");
    if(updateMarks){
    updateMarks.addEventListener("click", function () {
        localStorage.setItem("marksMode", "edit");
        localStorage.setItem("currentStudentId", currentStudentId);
        window.location.href = "marksForm.html";
    });
    }
    let deleteMarks = document.getElementById("deleteMarks");
    let deleteSubjectContainer = document.getElementById("deleteSubjectContainer");
    let deleteSubjectSelect = document.getElementById("deleteSubjectSelect");
    let confirmDeleteSubject = document.getElementById("confirmDeleteSubject");

    // Show dropdown when Delete Marks is clicked
    if(deleteMarks){
      deleteMarks.addEventListener("click", () => {
        deleteSubjectContainer.style.display = "block";
      });

      // Confirm deletion of selected subject
      confirmDeleteSubject.addEventListener("click", async () => {
        const subject = deleteSubjectSelect.value;

        if (!subject) {
          alert("Please select a subject to delete");
          return;
        }

        const confirmDelete = confirm(`Are you sure you want to delete marks for ${subject}?`);
        if (!confirmDelete) return;

        const response = await fetch(`http://localhost:3000/grades/${currentStudentId}/${subject}`, {
          method: "DELETE"
        });

        const result = await response.json();
        console.log("Delete response:", result);

        deleteSubjectContainer.style.display = "none";
        deleteSubjectSelect.value = "";

        // Optionally show success message
        alert("Subject marks deleted successfully!");

        loadMarks(currentStudentId);
      });
    }
    async function loadMarks(studentId) {
      const marksList = document.getElementById("marksList");
      while (marksList.firstChild) {
        marksList.removeChild(marksList.firstChild);
      }

      fetch(`http://localhost:3000/grades/${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.length === 0) {
            // If no marks
            const dash = document.createElement("p");
            dash.textContent = "-";
            dash.style.textAlign="center"
            dash.style.fontSize = "38px";
            dash.style.color = "gray";
            marksList.appendChild(dash);
          } else {
            // If marks exist
            data.forEach(item => {
              const line = document.createElement("div");
              line.style.display = "flex";
              line.style.justifyContent = "space-between";
              line.style.padding = "8px";
              line.style.borderBottom = "1px solid #ccc";

              const subject = document.createElement("span");
              subject.textContent = item.subject;

              const mark = document.createElement("span");
              mark.textContent = item.marks;

              line.append(subject, mark);
              marksList.appendChild(line);
            });
          }
        })
        .catch(err => {
          console.error("Failed to load marks", err);
        });
    }
  }

  //Marks Form
  if(currentPage.includes("marksForm.html")){
    let title=document.getElementById("formTitle");
    let btn=document.getElementById("submitMarks");
    let successMarks=document.getElementById("successMarks");
    let form=document.getElementById("marks-form");
    let sub1Err=document.getElementById("sub1Err");
    let sub2Err=document.getElementById("sub2Err");
    let sub3Err=document.getElementById("sub3Err");
    let sub4Err=document.getElementById("sub4Err");
    let sub1Inp=document.getElementById("subject1");
    let sub2Inp=document.getElementById("subject2");
    let sub3Inp=document.getElementById("subject3");
    let sub4Inp=document.getElementById("subject4");
    let sub1marksInp=document.getElementById("subject1marks");
    let sub2marksInp=document.getElementById("subject2marks");
    let sub3marksInp=document.getElementById("subject3marks");
    let sub4marksInp=document.getElementById("subject4marks");
    function validation(subInp,marksInp,errorMsg){
        const validate=()=>{
            if(subInp.value==="" || marksInp.value===""){
                errorMsg.textContent="*Required";
                errorMsg.style.color="red";
            }
            else{
                errorMsg.textContent="";
            }
        }
        subInp.addEventListener("blur",validate);
        marksInp.addEventListener("blur",validate);
    }
    validation(sub1Inp,sub1marksInp,sub1Err);
    validation(sub2Inp,sub2marksInp,sub2Err);
    validation(sub3Inp,sub3marksInp,sub3Err);
    validation(sub4Inp,sub4marksInp,sub4Err);
    let isEditingMarks = false;
    let currentStudentId = localStorage.getItem("currentStudentId");
    let backMarks = document.getElementById("backBtnMarks");
    if (backMarks) {
      backMarks.addEventListener("click", function () {
      window.location.href = "marksPage.html";
    });
    }
    if (localStorage.getItem("marksMode") === "add") {
      title.textContent="Enter Student Marks";
      btn.textContent="Submit";
      setupSubjectDropdowns()
    }
    else{
      title.textContent = "Edit Student Marks";
      btn.textContent = "Update";
      isEditingMarks=true;
      fetch(`http://localhost:3000/grades/${currentStudentId}`)
      .then(res => res.json())
      .then(data => {
        // Fill the form fields with existing data
        for (let i = 0; i < data.length; i++) {
          document.getElementById(`subject${i + 1}`).value = data[i].subject;
          document.getElementById(`subject${i + 1}marks`).value = data[i].marks;
        }
      });
      setupSubjectDropdowns()
    }
    function setupSubjectDropdowns() {
      const subjectSelects = document.querySelectorAll(".subject-select");

      subjectSelects.forEach(select => {
        select.addEventListener("change", () => {
          const selectedSubjects = Array.from(subjectSelects)
            .map(s => s.value)
            .filter(v => v !== "");

          subjectSelects.forEach(s => {
            const currentValue = s.value;

            Array.from(s.options).forEach(option => {
              if (option.value === "" || option.value === currentValue) {
                option.disabled = false;
              } else {
                option.disabled = selectedSubjects.includes(option.value);
              }
            });
          });
        });
      });
    }
    form.addEventListener("submit",async(event)=>{
    event.preventDefault();
    if(sub1Inp.value!=="" && sub1marksInp.value!=="" && sub2Inp.value!=="" && sub2marksInp.value!=="" && sub3Inp.value!=="" && sub3marksInp.value!=="" && sub4Inp.value!=="" && sub4marksInp.value!==""){
            const grades = [];

            for (let i = 1; i <= 4; i++) {
                const subject = document.getElementById(`subject${i}`)?.value;
                const marks = document.getElementById(`subject${i}marks`)?.value;

                if (subject && marks !== "") {
                    grades.push({ subject, marks: Number(marks) });
                }
            }

        if (!currentStudentId) {
            alert("Student ID not found!");
            return;
        }

            let url="http://localhost:3000/grades";
            let method="POST";
            let successText="Student Marks Added Successfully";
            if(isEditingMarks){
                url=`http://localhost:3000/grades/${currentStudentId}`;
                method="PUT";
                successText="Student Marks Updated Successfully";
            }
            const response=await fetch(url,{
                method,
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    studentId: currentStudentId,
                    grades: grades
                })
            });

            const result=await response.json();
            console.log("Server Response:",result);
            successMarks.textContent=successText;
            successMarks.style.display="block";
            form.reset();
            isEditingMarks = false;
            setTimeout(()=>{
                successMarks.style.display="none";
            },3000);
            if(method==="POST"){
              window.location.href="marksPage.html";
            }
    }
    });
    form.addEventListener("reset", () => {
      setTimeout(setupSubjectDropdowns, 10);
    });
  }
})