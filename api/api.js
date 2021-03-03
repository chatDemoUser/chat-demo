import axios from "axios";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    Pragma: "no-cache",
  },
};

export async function getAllMessagesFromSender(senderName) {
  const url = "/api/messages/all-from";

  const data = {
    senderName,
  };

  const response = await axios.get(url, {
    params: data,
    headers: config.headers,
  });
  return response.data;
}

export async function insertMessage(chatUser, message) {
  const url = "/api/messages/insert";
  const data = {
    recipientName: chatUser,
    message,
  };

  const response = await axios.post(url, null, {
    params: data,
    headers: config.headers,
  });
  return response.data;
}
