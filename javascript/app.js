import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    doc,
    setDoc,
    db,
    getDoc,
    updateDoc,
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    storage,
    reauthenticateWithCredential,
    EmailAuthProvider,
    updatePassword,
    collection, 
    addDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
    deleteDoc 
} from './firebase.js'


let spinner = document.getElementById('spiner');
let flag = true;
const profilePicture = document.getElementById("profilePicture");

const getCurrentUser = async (uid) => {
    spinner.style.display = "flex";
    const docRef = doc(db, "users", uid);
    let fullName = document.getElementById('fullName');
    let email = document.getElementById('email');
    let userUid = document.getElementById('uid');
    const docSnap = await getDoc(docRef);
    // console.log(docSnap)
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        if (location.pathname === "/blog.html") {
            fullName.innerHTML = docSnap.data().name;
        }else if(location.pathname !== "/allblog.html" && location.pathname === "/profile.html" && location.pathname !== "/user.html" ){
            fullName.value = docSnap.data().name;
            email.value = docSnap.data().email;
            userUid.value = docSnap.id;
            if(docSnap.data().profile){
            profilePicture.src = docSnap.data().profile;
            }
        } else  {
           
        }
        spinner.style.display = "none";

    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        spinner.style.display = "none";

    }
}

const getallUserBlog = async () => {
const blogArea = document.getElementById("AllBlogsContainer");
const querySnapshot = await getDocs(collection(db, "Blogs"));
querySnapshot.forEach((doc) => {
  console.log(doc.id, " => ", doc.data());
  blogArea.innerHTML += `
  <div class="mt-2 mb-2">
  <div class="head-blog mt-2">
      <div class="card border border-secondary-subtle rounded py-2">
          <div class="card-header d-flex gap-4">
          <img class="blog-avatar m-0"
                      src="${doc.data().user.profile ? doc.data().user.profile : "asset/user-circle.jpg"}"
                      alt="">
              <span class="d-flex flex-column justify-content-end">
          <h5 class="card-title mb-3">${doc.data().user.name}</h5>
                  <h6 class="card-subtitle text-body-secondary"> ${doc.data().timeStramp.toDate().toDateString()}</h6>
              </span>
          </div>
          <div class="card-body">
          <h5 class="card-title mb-3">${doc.data().title}</h5>
              <p class="card-text"> ${doc.data().discribtion}</p>
              <a href="user.html?user=${doc.data().uid}" class="card-link seeAll">view all blogs</a>
          </div>
        
      </div>
  </div>
</div>`
});

}

const getCurrentUserBlog = async(uid) => {
    const blogArea = document.getElementById("my-blogs");
    blogArea.innerHTML = " ";
    const q = query(collection(db, "Blogs"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        blogArea.innerHTML += `
        <div class="mt-2 mb-2">
        <div class="head-blog mt-2">
            <div class="card border border-secondary-subtle rounded py-2">
                <div class="card-header d-flex gap-4">
                <img class="blog-avatar m-0"
                            src="${doc.data().user.profile ? doc.data().user.profile : "asset/user-circle.jpg"}"
                            alt="">
                    <span class="d-flex flex-column justify-content-end">
                <h5 class="card-title mb-3">${doc.data().user.name}</h5>
                        <h6 class="card-subtitle text-body-secondary">${doc.data().timeStramp.toDate().toDateString()}</h6>
                    </span>
                </div>
                <div class="card-body">
                <h5 class="card-title mb-3">${doc.data().title}</h5>
                    <p class="card-text"> ${doc.data().discribtion}</p>
                    <a href="javascript:void(0)" class="card-link seeAll" onclick="deleteBlog('${doc.id}')">Delete</a>
                    <a href="javascript:void(0)" class="card-link seeAll" onclick="editBlog('${doc.id}', '${doc.data().title}', '${doc.data().discribtion}')">Edit</a>
                </div>
            </div>
        </div>
    </div>`

    console.log(doc.id, " => ", doc.data());
    });
}
onAuthStateChanged(auth, (user) => {
    if (user) {
        //   const uid = user.uid;
        getCurrentUser(user.uid);
        if(location.pathname === "/blog.html"){
        getCurrentUserBlog(user.uid)
        }else if(location.pathname !== "/blog.html" && location.pathname !== "/profile.html" && location.pathname !== "/user.html"){
            getallUserBlog();
        }else{
       
              
        }
        if (location.pathname !== "/user.html" && location.pathname !== "/allblog.html" && location.pathname !== "/blog.html" && location.pathname !== "/profile.html" && flag) {
            location.href = "blog.html"
        }
    } else {
        if (location.pathname !== "/start.html" && location.pathname !== "/signup.html") {
            location.href = "start.html"
        }

    }

});



let signupBtn = document.getElementById('signupBtn');
const signup = () => {
    let fullName = document.getElementById('fullName');
    let phone = document.getElementById('phone');
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    spinner.style.display = "flex";

    flag = false;
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(async (userCredential) => {
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name: fullName.value,
                phone: phone.value,
                email: email.value,
                password: password.value
            });
            console.log("user>>>>>>>" , user);
            flag = false;
            spinner.style.display = "none";
            location.href = "/blog.html"
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            spinner.style.display = "none";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })

        });


}
signupBtn && signupBtn.addEventListener("click", signup)

let signInBtn = document.getElementById('signInBtn');
const signIn = () => {
    let email = document.getElementById('email');
    let password = document.getElementById('password');
    spinner.style.display = "flex";

    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            const user = userCredential.user;
            spinner.style.display = "none";
            console.log("user", user)

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            spinner.style.display = "none";
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: errorMessage,
            })

        });
}

signInBtn && signInBtn.addEventListener("click", signIn);

let logoutBtn = document.getElementById("Logout");

const logout = () => {
    signOut(auth).then(() => {

    }).catch((error) => {
    });
}

logoutBtn && logoutBtn.addEventListener("click", logout);

let updateProfile = document.getElementById("updateBtn");
const fileInput = document.getElementById('fileInput');

const uploadProfile = (file) => {
    return new Promise((resolve, reject) => {
        const mountainImgRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable( mountainImgRef , file);

        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                reject(error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL);
                });
            }
        );
    })
}

const updateUserPassword  = (oldPass,newPass) => {
    return new Promise ((resolve,reject) => {
        const currentUser = auth.currentUser;
        console.log("currentUser" , currentUser )
        const credential = EmailAuthProvider.credential(
            currentUser.email,
            oldPass
        )
        reauthenticateWithCredential(currentUser, credential)
        .then((res) => {
            // console.log("res>>>>" , res);
            updatePassword(currentUser, newPass).then(() => {
                resolve(res);
              }).catch((error) => {
                reject(error)
              });
          }).catch((error) => {
            // console.log("error>>>>" , error);
            reject(error)
          });
    })
}
const update = async () => {
    try{ 
    let fullName = document.getElementById('fullName');
    let userUid = document.getElementById('uid');
    let OldPassword =document.getElementById("OldPassword");
    let newPassword = document.getElementById('newPassword');
   spinner.style.display = "flex";
    if(OldPassword.value && newPassword.value){
        console.log(OldPassword.value,newPassword.value);
      await  updateUserPassword(OldPassword.value,newPassword.value);
    }
    console.log("update");
    // let email = document.getElementById('email');  
    const user =  {
        name: fullName.value,
    }
    if(fileInput.files[0]){
        user.profile = await uploadProfile(fileInput.files[0]);
    }
    // console.log("profile",uploadProfileUrl);
    // console.log(fileInput.files[0])
    const useRef = doc(db, "users", userUid.value);
    await updateDoc(useRef, user);
    spinner.style.display = "none";
    OldPassword.value = "";
    newPassword.value = "";
    Swal.fire(
        'Good job!',
        'Profile Update',
        'success'
    )
   }catch(err){
    spinner.style.display = "none";
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.message,
    })
   }
}

updateProfile && updateProfile.addEventListener("click", update);



fileInput && fileInput.addEventListener("change", (e) => {
    profilePicture.src = URL.createObjectURL(e.target.files[0]);
    // console.log(e.target.files[0])
})

const postBlog = document.getElementById("postBlog");

const submitBlog = async () =>  {
    const title = document.getElementById("title");
    const textarea = document.getElementById("textarea");
    const currentUser = auth.currentUser;
    const userRef = doc(db, "users", currentUser.uid);
    const userData = await getDoc(userRef);
    console.log("users",userData.data());
    spinner.style.display = "flex";
    const docRef = await addDoc(collection(db, "Blogs"), {
        title: title.value,
        discribtion: textarea.value,
        timeStramp : serverTimestamp(),
        uid : currentUser.uid,
        user : userData.data()
      });
      getCurrentUserBlog(currentUser.uid)
      title.value = "";
      textarea.value = "";
      spinner.style.display = "none";
      Swal.fire(
        'Good job!',
        'Blog Published',
        'success'
    )
      
}

postBlog && postBlog.addEventListener("click",submitBlog);

const deleteBlog = async (id) => {
const currentUser = auth.currentUser;
console.log("id", id)
spinner.style.display = "flex";
await deleteDoc(doc(db, "Blogs", id));
getCurrentUserBlog(currentUser.uid)
spinner.style.display = "none";
Swal.fire(
    'Good job!',
    'Blog Deleted',
    'success'
)
}
const updateModal = document.getElementById("updateModal");
const updateTitle = document.getElementById('update-title');
const updateTextArea = document.getElementById('update-textarea');

let updateId = "";
const editBlog = (id,tittle,discribtion) => {
    updateId = id;
    updateModal.style.display = "block";
    updateTitle.value = tittle;
    updateTextArea.value = discribtion;

}

const updatePostBlog = document.getElementById('updatePostBlog');
updatePostBlog && updatePostBlog.addEventListener('click', async() => {

    spinner.style.display = "flex";
    const currentUser = auth.currentUser;    
    console.log( updateTitle.value,updateTextArea.value,updateId)
    const ref = doc(db, "Blogs", updateId);

await updateDoc(ref, {
  title:updateTitle.value,
  discribtion:updateTextArea.value
});
getCurrentUserBlog(currentUser.uid)
spinner.style.display = "none";

Swal.fire(
    'Good job!',
    'Blog Update',
    'success'
)
updateModal.style.display = 'none';

})

const cancleBtn = document.getElementById('cancleBtn');

cancleBtn && cancleBtn.addEventListener("click" , (e)=> {
    updateModal.style.display = "none";
})


window.deleteBlog = deleteBlog;
window.editBlog = editBlog;

const getUserBlog = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('user');
    const blogArea = document.getElementById("user-blog-add");
    const profileArea = document.getElementById('profile');

    const userRef = doc(db, "users", myParam );
    const userData = await getDoc(userRef);
    // console.log("userData", userData.data())
    profileArea.innerHTML=`
    <div class="card">
    <img width="10px"
        src="${userData.data().profile ? userData.data().profile : "asset/user-circle.jpg"}"
        class="card-img-top" alt="...">
    <div class="card-body">
        <h5 class="card-title">${userData.data().name}</h5>
        <p class="email">${userData.data().email}</p>
    </div>
</div>`


    blogArea.innerHTML = " ";
    const q = query(collection(db, "Blogs"), where("uid", "==", myParam));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        blogArea.innerHTML += `
        <div class="mt-2 mb-2">
        <div class="head-blog mt-2">
            <div class="card border border-secondary-subtle rounded py-2">
                <div class="card-header d-flex gap-4">
                <img class="blog-avatar m-0"
                            src="${doc.data().user.profile ? doc.data().user.profile : "asset/user-circle.jpg"}"
                            alt="">
                    <span class="d-flex flex-column justify-content-end">
                <h5 class="card-title mb-3">${doc.data().user.name}</h5>
                        <h6 class="card-subtitle text-body-secondary">${doc.data().timeStramp.toDate().toDateString()}</h6>
                    </span>
                </div>
                <div class="card-body">
                <h5 class="card-title mb-3">${doc.data().title}</h5>
                    <p class="card-text"> ${doc.data().discribtion}</p>
                </div>
            </div>
        </div>
    </div>`

    console.log(doc.id, " => ", doc.data());
    });
    console.log("params", myParam)
}

if(location.pathname === '/user.html'){
    getUserBlog()
}

let showPassword = document.getElementById("showPassword")
let passwordToggle = false;
showPassword && showPassword.addEventListener("click", () => {
    let password = document.getElementById("password")
    if (passwordToggle) {
        passwordToggle = false;
        showPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" 
    width="32" height="32" viewBox="0 0 15 15"><path fill="currentColor"
     d="M7.5 9C5.186 9 3.561 7.848 2.497 6.666a9.368 9.368 0 0 1-1.449-2.164a5.065 5.065 0 0 1-.08-.18l-.004-.007v-.001L.5 4.5l-.464.186v.002l.003.004a2.107 2.107 0 0 0 .026.063l.078.173a10.367 10.367 0 0 0 1.61 2.406C2.94 8.652 4.814 10 7.5 10V9Zm7-4.5a68.887 68.887 0 0 1-.464-.186l-.003.008l-.015.035l-.066.145a9.37 9.37 0 0 1-1.449 2.164C11.44 7.848 9.814 9 7.5 9v1c2.686 0 4.561-1.348 5.747-2.666a10.365 10.365 0 0 0 1.61-2.406a6.164 6.164 0 0 0 .104-.236l.002-.004v-.001h.001L14.5 4.5ZM8 12V9.5H7V12h1Zm-6.646-1.646l2-2l-.708-.708l-2 2l.708.708Zm10.292-2l2 2l.708-.708l-2-2l-.708.708Z"/>
     </svg>`
        password.type = "password"

    }
    else {
        showPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
        viewBox="0 0 20 20">
        <path fill="currentColor"
            d="M10 4.4C3.439 4.4 0 9.232 0 10c0 .766 3.439 5.6 10 5.6c6.56 0 10-4.834 10-5.6c0-.768-3.44-5.6-10-5.6zm0 9.907c-2.455 0-4.445-1.928-4.445-4.307c0-2.379 1.99-4.309 4.445-4.309s4.444 1.93 4.444 4.309c0 2.379-1.989 4.307-4.444 4.307zM10 10c-.407-.447.663-2.154 0-2.154c-1.228 0-2.223.965-2.223 2.154s.995 2.154 2.223 2.154c1.227 0 2.223-.965 2.223-2.154c0-.547-1.877.379-2.223 0z" />
    </svg>`
        passwordToggle = true;
        password.type = "text"
    }
})

