// Login Page
// let loginPage=document.getElementById("loginPage");
// let homePage=document.getElementById("homePage");
// Redirect to login if not logged in and not on login page
const currentPage = window.location.pathname;
if (!localStorage.getItem("isLoggedIn") && !currentPage.includes("login.html")) {
    window.location.href = "login.html";
}
let loginButton=document.getElementById("loginButton");
let username=document.getElementById("username");
let password=document.getElementById("password");
let requirename=document.getElementById("usernameRequired");
let requirepass=document.getElementById("passwordRequired");
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
        // loginPage.style.display="none";
        // homePage.style.display="block";
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "homePage.html";
    }
})

//Add form and Edit form
let addForm=document.getElementById("addDetails");
//let newForm=document.getElementById("newForm");
addForm.addEventListener("click",function(){
    // homePage.style.display="none";
    // newForm.style.display="block";
    window.location.href = "newForm.html";
    let title=document.getElementById("form-title").textContent="Enter Student Details";
    let btn=document.getElementById("submit").textContent="Submit";
    fillForm.reset();
    isEditing=false;
    editingId=null;
})
let back=document.getElementById("backBtn");
backBtn.onclick=()=>{
    // newForm.style.display="none";
    // homePage.style.display="block";
    window.location.href = "homePage.html";
    fillForm.reset();
    isEditing=false;
    editingId=null;
}
let nameErr=document.getElementById("name");
let numberErr=document.getElementById("admissionNumber");
let addressErr=document.getElementById("address");
let branchErr=document.getElementById("branch");
let nameInp=document.getElementById("inputName");
let numberInp=document.getElementById("inputNumber");
let addressInp=document.getElementById("inputAddress");
let branchInp=document.getElementById("inputBranch");
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
let success=document.getElementById("success");
let fillForm=document.getElementById("add-form");
//let marks=document.getElementById("marksPage");
let isEditing = false;
let editingId = null;
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
        // alert("Student Added Successfully!");
        fillForm.reset();
        isEditing = false;
        editingId = null;
        loadStudents();
        setTimeout(()=>{
            success.style.display="none";
        },3000);
        //Back to Home Page after adding student
        if(method==="POST"){
          window.location.href = "homePage.html";   
        }
    }
});

//Home Page
let backDetails=document.getElementById("backBtndetails");
let currentStudentId = null;
let isEditingMarks = false;
backDetails.onclick=()=>{
    //document.getElementById("studentDetails").style.display = "none";
    window.location.href = "homePage.html";
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
    name.onclick = () => showStudentDetails(student);

    let actionsGroup=document.createElement("div");

    let show=document.createElement("button");
    show.classList.add("actionsBtn");
    show.textContent="Marks";
    show.style.fontSize="10px";
    show.onclick=()=>showStudent(student._id);

    let edit=document.createElement("button");
    edit.classList.add("actionsBtn");
    edit.textContent="Edit";
    edit.style.fontSize="10px";
    edit.style.marginLeft="3px";
    edit.style.marginRight="3px";
    edit.onclick=()=>editStudent(student);

    let del=document.createElement("button");
    del.classList.add("actionsBtn");
    del.style.fontSize="10px";
    del.textContent="Delete";
    del.onclick=()=>delStudent(student._id,strip);

    actionsGroup.append(show,edit,del);
    strip.append(name,actionsGroup);
    list.appendChild(strip);
  });
}
function showStudentDetails(student) {
  currentStudentId=student._id;
  document.getElementById("sname").textContent = `Name: ${student.name}`;
  document.getElementById("sadmission").textContent = `Admission No.: ${student.admissionNumber}`;
  document.getElementById("saddress").textContent = `Address: ${student.address}`;
  document.getElementById("sbranch").textContent = `Branch: ${student.branch}`;
  // document.getElementById("studentDetails").style.display = "block";
  // homePage.style.display="none";
  window.location.href = "studentDetails.html";
}
function editStudent(student){
  let title=document.getElementById("form-title").textContent="Edit Student Details";
  let btn=document.getElementById("submit").textContent="Update";
  // newForm.style.display = "block";
  // homePage.style.display="none";
  window.location.href = "newForm.html";
  nameInp.value = student.name;
  numberInp.value = student.admissionNumber;
  addressInp.value = student.address;
  branchInp.value = student.branch;

  isEditing = true;
  editingId = student._id;
}
async function delStudent(id,strip){
    const confirmed = confirm("Are you sure you want to delete this student?");
  if (!confirmed) return;

  try {
    const response = await fetch(`http://localhost:3000/students/${id}/delete`, {
      method: "PUT"
    });

    const result = await response.json();
    //console.log(result.message);

    // ✅ Remove from screen
    strip.remove();

    // ✅ Optional: success message
    //showTempMessage("Student deleted successfully!", "green");

  } catch (error) {
    console.error("Delete failed:", error);
    //showTempMessage("Error deleting student.", "red");
  }
}
function showStudent(studentId){
    // marks.style.display="block";
    // homePage.style.display="none";
    window.location.href = "marksPage.html";
    currentStudentId=studentId;
    loadMarks(studentId);
    fetch(`http://localhost:3000/grades/${studentId}`)
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
}

//Add marks form and update marks form
let addMarks=document.getElementById("addMarks");
//let marksForm=document.getElementById("marksForm");
let form=document.getElementById("marks-form");
addMarks.addEventListener("click",function(){
    // marksPage.style.display="none";
    // marksForm.style.display="block";
    window.location.href = "marksForm.html";
    setupSubjectDropdowns();
    let title=document.getElementById("formTitle").textContent="Enter Student Marks";
    let btn=document.getElementById("submitMarks").textContent="Submit";
    form.reset();
    isEditingMarks=false;
})
let backMarksform=document.getElementById("backBtnMarks");
backMarksform.onclick=()=>{
    // marksForm.style.display="none";
    // marks.style.display="block";
    window.location.href = "marksPage.html";
}
let updateMarks=document.getElementById("updateMarks");
updateMarks.addEventListener("click",function() {
  isEditingMarks = true;
  // marksPage.style.display="none";
  // marksForm.style.display="block";
  window.location.href = "marksForm.html";
  setupSubjectDropdowns();
  let title=document.getElementById("formTitle").textContent="Update Student Marks";
  let btn=document.getElementById("submitMarks").textContent="Update";

  fetch(`http://localhost:3000/grades/${currentStudentId}`)
    .then(res => res.json())
    .then(data => {
      // Fill the form fields with existing data
      for (let i = 0; i < data.length; i++) {
        document.getElementById(`subject${i + 1}`).value = data[i].subject;
        document.getElementById(`subject${i + 1}marks`).value = data[i].marks;
      }
    });
})
let deleteMarks = document.getElementById("deleteMarks");
let deleteSubjectContainer = document.getElementById("deleteSubjectContainer");
let deleteSubjectSelect = document.getElementById("deleteSubjectSelect");
let confirmDeleteSubject = document.getElementById("confirmDeleteSubject");

// Show dropdown when Delete Marks is clicked
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
let successMarks=document.getElementById("successMarks");
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
            console.log("👉 Grades being submitted:", grades);
            console.log("👉 Current Student ID:", currentStudentId);
            console.log("👉 Method:", method, "| URL:", url);

            const result=await response.json();
            console.log("Server Response:",result);
            successMarks.textContent=successText;
            successMarks.style.display="block";
            // alert("Student Added Successfully!");
            form.reset();
            isEditingMarks = false;
            //loadMarks();
            setTimeout(()=>{
                successMarks.style.display="none";
            },3000);
    }
    // else{
    //    validation(sub1Inp,sub1marksInp,sub1Err);
    //    validation(sub2Inp,sub2marksInp,sub2Err);
    //    validation(sub3Inp,sub3marksInp,sub3Err);
    //    validation(sub4Inp,sub4marksInp,sub4Err); 
    // }
});
form.addEventListener("reset", () => {
  setTimeout(updateSubjectOptions, 10);
});

//Marks Page
let backMarks=document.getElementById("backBtnmarks");
backMarks.onclick=()=>{
    // marks.style.display="none";
    // homePage.style.display="block";
    window.location.href = "homePage.html";
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
window.onload=loadStudents();