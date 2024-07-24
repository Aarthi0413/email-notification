document.getElementById('menuIcon').addEventListener('click', () => {
  const emailSection = document.getElementById('emailHeading');
  emailSection.classList.toggle('show');
});

document.getElementById('emailManager').addEventListener('click', () => {
  const emailSection = document.getElementById('dropDown');
  emailSection.classList.toggle('show_list');
});

// Getting user Id and username
const personSelect = document.getElementById('person-select');
domo.get(`/domo/users/v1?includeDetails=true&limit=200`).then(function (data) {
  //console.log(data[0].id)

  data.forEach(user => {
    const option = document.createElement('option');
    option.value = user.id;
    option.textContent = user.displayName;
    personSelect.appendChild(option);
  });

  // Getting current user id and display their name
  data.forEach(ele => {
    if (ele.id == domo.env.userId) {
      document.getElementById("welcomeText").textContent = 'Welcome ' + ele.displayName + '!';
      console.log(ele.displayName)
    }
  })
});

// Sending email functionality

function SendEmail() {
  //console.log("Sending Email to:");
  const selectedValues = [...personSelect.selectedOptions].map(option => option.value);
  //console.log(selectedValues);
  // selectedUserId.push(...selectedValues);
  // console.log(selectedUserId)
  const startWorkflow = (alias, body) => {
    domo.post(`/domo/workflow/v1/models/${alias}/start`, body)
  }
  let successfulEmailsSent = 0;
  selectedValues.forEach(user_id => {
    startWorkflow("send_email", { to: user_id, sub: 'Email Checking', body: 'Checking message is revceived or not received' })
    successfulEmailsSent++;
    //console.log(user_id)
    if (successfulEmailsSent === selectedValues.length) {
      displaySuccessMessage();
    }
  }
  )
}

function displaySuccessMessage() {
  const succes_message = document.getElementById('successMsg');
  succes_message.textContent = 'Mail sent successfully! ✅';
  succes_message.classList.add('show-message');
  setTimeout(() => {
    succes_message.classList.remove('show-message');
  }, 3000);
}

