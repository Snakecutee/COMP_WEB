import React from 'react';

const DetailPage = ({user}) =>{
    if (user?.dateOfBirth != null) {
        let currentTime = new Date(user?.dateOfBirth);
        let month = currentTime.getMonth() + 1;
        let day = currentTime.getDate();
        let year = currentTime.getFullYear();
        var dateOfBirthFormated = day + "/" + month + "/" + year;
   }


    return (
        <>
            <div className="p-10 my-10">
                <p className="font-medium">Username: <span className="font-light">{user?.username}</span></p>
                <p className="font-medium">Fullname: <span className="font-light">{user?.fullname}</span></p>
                <p className="font-medium">Email: <span className="font-light">{user?.email}</span></p>
                <p className="font-medium">Age: <span className="font-light">{user?.age}</span></p>
                <p className="font-medium">Date Of Birth: <span className="font-light">{dateOfBirthFormated}</span></p>
                <p className="font-medium">Gender: <span className="font-light">{user?.gender}</span></p>
                <p className="font-medium">Role: <span className="font-light">{user?.role}</span></p>
                <p className="font-medium">Department: <span className="font-light">{user?.department}</span></p>
            </div>  
        </>
    );
}
  
export default DetailPage;