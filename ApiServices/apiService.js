import axios from "axios";
import { toast } from "react-toastify";
import cookies from "js-cookie";
import DateFormat from "../CommonFunctions/dateTime";
export const getRoles = async (setRole) => {
  try {
    let loginInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/roles/get-role`
    );

    setRole(loginInfo?.data);
  } catch (err) {
    console.log("err", err);
  }
};

export const registerFunction = async (
  data,
  user,
  router,
  setLoading,
  phone,
  role,
  marketingName,
  state,
  setloginconfirmModalShow,
  setsignupconfirmModalshow,
  profileChange,
  setProfileChange
) => {
  try {
    setLoading(true);
    let obj;
    if (role.includes("Organizer")) {
      obj = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: phone,

        birthDate: data.birthDate,
        role: user,

        marketing: marketingName,
      };
    } else {
      obj = {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: phone,

        birthDate: data.birthDate,
        role: user,
      };
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/signup`,
      obj
    );

    toast.success(response?.data?.message || "تم التسجيل بنجاح");

    if (state === true) {
      cookies.set("token", response.data.token);
      cookies.set("role", response.data.data.role.roleName);
      setProfileChange(!profileChange);
      setsignupconfirmModalshow(false);
      // setloginconfirmModalShow(true);
    } else {
      if (response.data.data.role.roleName === "User") {
        cookies.set("token", response.data.token);
        cookies.set("role", response.data.data.role.roleName);
        router.push("/");
      } else {
        router.push("/admin/login");
      }
    }
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const loginFunction = async (
  user,
  router,
  setLoading,
  path,
  dataState,
  loginhandleCloseConfirm,
  profileChange,
  setProfileChange
) => {
  try {
    setLoading(true);
    const loginResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/login`,
      {
        email: user.email,
        password: user.password,
      }
    );

    toast.success(loginResponse?.data?.message || "تم تسجيل الدخول بنجاح");

    cookies.set("token", loginResponse.data.token);
    cookies.set("role", loginResponse.data.data.role.roleName);
    let roleData = cookies.get("role");
    if (dataState) {
      setProfileChange(!profileChange);
      loginhandleCloseConfirm();
    } else if (
      !path.includes("login") &&
      !path.includes("signup") &&
      !path.includes("admin/create-trip")
    ) {
      if (roleData === "Organizer") {
        if (path.includes(process.env.NEXT_PUBLIC_PATHNAME)) {
          router.push(path);
        } else {
          router.push("/");
        }
      } else {
        if (
          path.includes(`${process.env.NEXT_PUBLIC_PATHNAME}/my-trip`) ||
          path.includes(
            `${process.env.NEXT_PUBLIC_PATHNAME}/admin/profile-page `
          ) ||
          path.includes(
            `${process.env.NEXT_PUBLIC_PATHNAME}/admin/profile-page`
          ) ||
          path.includes(`${process.env.NEXT_PUBLIC_PATHNAME}/search-trip`)
        ) {
          router.push(path);
        } else {
          router.push("/");
        }
      }
    } else {
      router.push("/");
    }

    setLoading(false);
  } catch (error) {
    setLoading(false);
    if (error?.response?.data?.message) {
      toast.error(error?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const getProfileFunction = async (
  token,
  setValue,
  setLoading,
  router,

  selectedImageData,
  setSelectedImageData,
  setSelectedImage,
  setBirthdayDate
) => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-single-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { name, email, phone, birthDate, profileImage } =
      response?.data?.data;

    const formattedBirthDate = birthDate
      ? new Date(birthDate).toISOString().split("T")[0]
      : "";

    setValue("name", name);
    setValue("email", email);
    setValue("phone", phone);
    setBirthdayDate(formattedBirthDate);

    setSelectedImage(profileImage);
    setSelectedImageData(null);
    setLoading(false);
    //  document.getElementById("profiledata").innerHTML=name;
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message[0]);
    } else {
      // toast.error("هناك خطأ ما!");
    }
  }
};

export const getProfile = async (token, setProfile, setLoading, router) => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-single-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { name, profileImage } = response?.data?.data;
    setLoading(false);
    setProfile({
      image: profileImage,
      name: name,
    });
  } catch (err) {
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};
export const getProfileForDocuments = async (
  token,
  setProfile,
  setLoading,
  router,
  setValue
) => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-single-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProfile({
      id: "",
      passport: "",
      firstName: response?.data?.data?.name?.split(" ")[0]
        ? response?.data?.data?.name?.split(" ")[0]
        : "",
      lastName: response?.data?.data?.name?.split(" ")[1]
        ? response?.data?.data?.name?.split(" ")[1]
        : "",
      gender: "",
      phone: response?.data?.data?.phone,
      email: response?.data?.data?.email,
      healthIssues: "",

      age: "",
    });
    if (response?.data?.data?.name?.split(" ")[0]) {
      setValue("firstName", response?.data?.data?.name?.split(" ")[0]);
    }
    if (response?.data?.data?.name?.split(" ")[0]) {
      setValue("firstName", response?.data?.data?.name?.split(" ")[0]);
    }
    setValue("phone", response?.data?.data?.phone);
    setValue("email", response?.data?.data?.email);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message[0]);
    } else {
      // toast.error("هناك خطأ ما!");
    }
  }
};
export const getProfileInfo = async (
  token,
  setFlightInformation,
  setLoading,
  router,
  setValue
) => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/get-single-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFlightInformation({
      country: "",
      date: "",
      duration: "",
      tripIncludes: "",
      price: "",
      email: response?.data?.data?.email,
      name: response?.data?.data?.name,
      phone: response?.data?.data?.phone,
      tripName: "",
      groupType: "",
      tripType: "",
      image: "",
    });

    setValue("name", response?.data?.data?.name);
    setValue("phone", "0" + response?.data?.data?.phone);
    setValue("email", response?.data?.data?.email);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message[0]);
    } else {
      // toast.error("هناك خطأ ما!");
    }
  }
};

export const updateProfileFunction = async (
  token,
  value,
  user,
  setUser,
  setLoading,
  router,
  setValue,
  OverlayAcceptSetIsOpen,
  selectedImageData,
  setSelectedImageData,
  setSelectedImage,
  setEditProfile,
  editProfile,
  birthdayDate
) => {
  try {
    setLoading(true);
    const obj = {};
    const formData = new FormData();
    if (user?.password) {
      formData.append("password", user?.password);
    }

    if (value?.phone) {
      formData.append("phone", value?.phone);
    }
    if (value?.name) {
      formData.append("name", value?.name);
    }
    if (birthdayDate) {
      formData.append("birthDate", birthdayDate);
    }
    if (selectedImageData) {
      formData.append("profileImage", selectedImageData);
    }
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setUser(response?.data);

    getProfileFunction(
      token,
      setValue,
      setLoading,
      router,
      selectedImageData,
      setSelectedImageData,
      setSelectedImage
    );
    setEditProfile(!editProfile);
    OverlayAcceptSetIsOpen(true);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.errMessages[0]) {
      if (err?.response?.data?.errMessages[0]?.birthDate) {
        toast.error(err?.response?.data?.errMessages[0]?.birthDate);
      }
    } else if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
    getProfileFunction(
      token,
      setValue,
      setLoading,
      router,
      selectedImageData,
      setSelectedImageData,
      setSelectedImage
    );
  }
};

export const getAllTrips = async (
  setGetTrips,
  setTotalDocs,
  setLimit,
  setLoading,

  selectedTripType,

  selectedGroupType,
  currentPage,
  router,
  countryTypeData,
  organizerList
) => {
  try {
    if (
      !selectedTripType &&
      !selectedGroupType &&
      !countryTypeData &&
      !organizerList
    ) {
      setLoading(true);
    }

    let url = "";
    if (organizerList === undefined || !organizerList) {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-all-trips?page=${currentPage}&limit=12&tripType=${selectedTripType}&groupType=${selectedGroupType}&country=${countryTypeData}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-all-trips?page=${currentPage}&limit=12&tripType=${selectedTripType}&groupType=${selectedGroupType}&country=${countryTypeData}&search=${organizerList}`;
    }
    let allTrips = await axios.get(url);
    setGetTrips(allTrips?.data?.data?.docs);
    setTotalDocs(allTrips?.data?.data?.totalDocs);
    setLimit(allTrips?.data?.data?.limit);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log("error", error);
  }
};
export const getAllTripsHomePage = async (
  setGetTrips,
  setTotalDocs,
  setLimit,
  setLoading,

  selectedTripType,

  selectedGroupType,
  currentPage,
  router,
  countryTypeData,
  organizerList
) => {
  try {
    if (
      !selectedTripType &&
      !selectedGroupType &&
      !countryTypeData &&
      !organizerList
    ) {
      setLoading(true);
    }

    let url = "";
    if (organizerList === undefined || !organizerList) {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-all-visible-trips?page=${currentPage}&limit=12&tripType=${selectedTripType}&groupType=${selectedGroupType}&country=${countryTypeData}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-all-visible-trips?page=${currentPage}&limit=12&tripType=${selectedTripType}&groupType=${selectedGroupType}&country=${countryTypeData}&search=${organizerList}`;
    }
    let allTrips = await axios.get(url);
    setGetTrips(allTrips?.data?.data?.docs);
    setTotalDocs(allTrips?.data?.data?.totalDocs);
    setLimit(allTrips?.data?.data?.limit);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    console.log("error", error);
  }
};
export const getSingleTrip = async (id, setGetTrip, setLoading, router) => {
  try {
    setLoading(true);

    if (id) {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-single-trip/${id}`
      );
      setGetTrip(data?.data);
      setLoading(false);
    }
  } catch (err) {
    setLoading(false);

    if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const addDestinationForm = async (
  token,
  addDestination,
  router,
  organizerInfo,
  documentInfo,
  setConfirmModalShow,
  confirmModalShow,
  setLoading
) => {
  let stateManage = false;
  const destinationDataDate = [];
  let i = 0;
  for (i = 0; i < addDestination?.length; i++) {
    try {
      const formData = new FormData();
      const dateObj = new Date(addDestination[i]?.date);
      const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

      const day = ("0" + dateObj.getDate()).slice(-2);

      const year = dateObj.getFullYear();
      const shortDate = `${month}-${day}-${year}`;
      formData.append("city", addDestination[i]?.city);
      formData.append("duration", addDestination[i]?.duration);
      formData.append("agenda", addDestination[i]?.agenda);
      formData.append("hotelName", addDestination[i]?.hotelName);
      formData.append("destinationDate", shortDate);
      for (let j = 0; j < addDestination[i]?.faceImage?.length; j++) {
        formData.append("destinationImage", addDestination[i]?.faceImage[j]);
      }
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/destinations/add-destination`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const id = response.data.data._id;
      destinationDataDate?.push(id);
    } catch (err) {
      console.log("err", err);
      setLoading(false);
      stateManage = true;
      if (err?.response?.data?.message === "unAuthorized") {
        cookies.remove("token");
        cookies.remove("role");
        router.push("/admin/login?User=false");
      } else if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        toast.error("خطأ أثناء إنشاء الوجهةيرجى إضافة المزيد من الوقت ");
        router.push("/admin/trip-info");
      } else {
        toast.error("هناك خطأ ما!");
        router.push("/admin/trip-info");
      }
    }
  }

  if (i === addDestination?.length && stateManage === false) {
    createDocuments(
      token,
      documentInfo,
      organizerInfo,
      destinationDataDate,
      router,
      setConfirmModalShow,
      confirmModalShow,
      setLoading
    );
  }
};

export const createTrip = async (
  token,
  documentsInfo,
  organizerInfo,
  destinationInfo,
  router,
  setConfirmModalShow,
  confirmModalShow,
  setLoading
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("country", organizerInfo?.country);
    formData.append("document", documentsInfo);
    formData.append("tripDate", organizerInfo?.date);
    formData.append("tripDuration", organizerInfo?.duration);
    formData.append("tripIncludes", organizerInfo?.tripIncludes);
    formData.append(
      "tripPrice",
      `${organizerInfo?.price} ${organizerInfo?.currency}`
    );
    formData.append("contactName", organizerInfo?.name);
    formData.append("contactPhone", organizerInfo?.phone);
    formData.append("contactEmail", organizerInfo?.email);
    formData.append("mainTripImage", organizerInfo?.image);
    formData.append("tripName", organizerInfo?.tripName);
    formData.append("groupType", String(organizerInfo?.groupType));
    formData.append("tripType", organizerInfo?.tripType);
    formData.append("tripLogo", organizerInfo?.tripLogo);
    formData.append("termAndConditions", organizerInfo?.termsAndConditions);
    for (let i = 0; i < destinationInfo?.length; i++) {
      formData.append(`destination[${i}]`, destinationInfo[i]);
    }
    const tripAdded = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/create-trip`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    toast.success(tripAdded?.data?.message);
    setConfirmModalShow(true);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);

      router.push("/admin/trip-info");
    } else {
      toast.error("هناك خطأ ما!");
      router.push("/admin/trip-info");
    }
  }
};

export const createDocuments = async (
  token,
  documentInfo,
  organizerInfo,
  destinationDataDate,
  router,
  setConfirmModalShow,
  confirmModalShow,
  setLoading
) => {
  try {
    setLoading(true);
    const documentsInfo = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/documents/create-document`,
      documentInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    createTrip(
      token,
      documentsInfo?.data?.data?._id,
      organizerInfo,
      destinationDataDate,
      router,
      setConfirmModalShow,
      confirmModalShow,
      setLoading
    );
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
      router.push("/admin/trip-info");
    } else {
      toast.error("هناك خطأ ما!");
      router.push("/admin/trip-info");
    }
  }
};

export const getTripInfo = async (
  setTripInfo,
  token,
  setLoading,
  router,
  setLimit,
  setTotalDocs,
  currentPage
) => {
  try {
    setLoading(true);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/organizers/get-organizer-trip?page=${currentPage}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTripInfo(response?.data?.data?.docs);
    setTotalDocs(response?.data?.data?.totalDocs);
    setLimit(response?.data?.data?.limit);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const deleteTripData = async (
  id,
  setLoading,
  router,
  token,
  setTripInfo,
  setLimit,
  setTotalDocs,
  currentPage
) => {
  try {
    setLoading(true);
    const deletetrip = await axios.delete(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/delete-trip/${id}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(deletetrip?.data?.message);
    getTripInfo(
      setTripInfo,
      token,
      setLoading,
      router,
      setLimit,
      setTotalDocs,
      currentPage
    );
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const updateDestination = async (
  token,
  addDestination,
  router,
  organizerInfo,

  documentInfo,
  setConfirmModalShow,
  confirmModalShow,
  setLoading,
  id,
  documentId
) => {
  let stateManage = false;
  const destinationDataDate = [];
  let i = 0;
  for (i = 0; i < addDestination?.length; i++) {
    try {
      const formData = new FormData();
      const dateObj = new Date(addDestination[i]?.date);
      const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);

      const day = ("0" + dateObj.getDate()).slice(-2);

      const year = dateObj.getFullYear();
      const shortDate = `${month}-${day}-${year}`;
      formData.append("city", addDestination[i]?.city);
      formData.append("duration", addDestination[i]?.duration);
      formData.append("agenda", addDestination[i]?.agenda);
      formData.append("destinationDate", shortDate);
      formData.append("hotelName", addDestination[i]?.hotelName);
      setLoading(true);

      if (addDestination[i]?.image === 0) {
        for (let j = 0; j < addDestination[i]?.faceImage?.length; j++) {
          formData.append("destinationImage", addDestination[i]?.faceImage[j]);
        }
      }
      var responseData;
      if (addDestination[i]?.id) {
        responseData = await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/destinations/update-destination/${addDestination[i]?.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        responseData = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}/destinations/add-destination`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      const id = responseData.data.data._id;
      destinationDataDate?.push(id);
    } catch (err) {
      stateManage = true;
      setLoading(false);
      if (err?.response?.data?.message === "unAuthorized") {
        cookies.remove("token");
        cookies.remove("role");
        router.push("/admin/login?User=false");
      } else if (err?.response?.data?.message) {
        toast.error(err?.response?.data?.message);
        router.push(`/admin/edit-info/${id}`);
      } else {
        toast.error("هناك خطأ ما!");
        router.push(`/admin/edit-info/${id}`);
      }
    }
  }

  if (i === addDestination?.length && stateManage === false) {
    updateDocuments(
      token,
      documentInfo,
      organizerInfo,
      destinationDataDate,
      router,
      setConfirmModalShow,
      confirmModalShow,
      setLoading,
      id,
      documentId
    );
  }
};

export const updateTrip = async (
  token,
  documentsInfo,
  organizerInfo,
  destinationInfo,
  router,
  setConfirmModalShow,
  confirmModalShow,
  id,
  setLoading
) => {
  try {
    setLoading(true);
    const formData = new FormData();
    formData.append("country", organizerInfo?.country);
    formData.append("document", documentsInfo);
    formData.append("tripDate", organizerInfo?.date);
    formData.append("tripDuration", organizerInfo?.duration);
    formData.append("tripIncludes", organizerInfo?.tripIncludes);

    formData.append(
      "tripPrice",
      `${organizerInfo?.price?.replace(/[^0-9]/g, "")} ${
        organizerInfo?.currency
      }`
    );
    formData.append("contactName", organizerInfo?.name);
    formData.append("contactPhone", organizerInfo?.phone);
    formData.append("contactEmail", organizerInfo?.email);
    if (organizerInfo?.mainTripDummy) {
      formData.append("mainTripImage", organizerInfo?.mainTripDummy);
    }

    if (organizerInfo?.logoTripDummy) {
      formData.append("tripLogo", organizerInfo?.logoTripDummy);
    }
    formData.append("tripName", organizerInfo?.tripName);
    formData.append("groupType", String(organizerInfo?.groupType));
    formData.append("tripType", organizerInfo?.tripType);
    formData.append("termAndConditions", organizerInfo?.termsAndConditions);
    for (let i = 0; i < destinationInfo?.length; i++) {
      formData.append(`destination[${i}]`, destinationInfo[i]);
    }
    const tripAdded = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/update-trip/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setLoading(false);
    toast.success(tripAdded?.data?.message);
    setConfirmModalShow(true);
  } catch (err) {
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
      router.push(`/admin/edit-info/${id}`);
    } else {
      toast.error("هناك خطأ ما!");
      router.push(`/admin/edit-info/${id}`);
    }
  }
};

export const updateDocuments = async (
  token,
  documentInfo,
  organizerInfo,
  destinationDataDate,
  router,
  setConfirmModalShow,
  confirmModalShow,
  setLoading,
  id,
  documentId
) => {
  try {
    setLoading(true);
    const documentsInfo = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/documents/update-document/${documentId}`,
      documentInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    updateTrip(
      token,
      documentsInfo?.data?.data?._id,
      organizerInfo,
      destinationDataDate,
      router,
      setConfirmModalShow,
      confirmModalShow,
      id,
      setLoading
    );
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
      router.push(`/admin/edit-info/${id}`);
    } else {
      toast.error("هناك خطأ ما!");
      router.push(`/admin/edit-info/${id}`);
    }
  }
};

export const getJoiningRequest = async (
  setTripDetails,
  setLoading,
  token,
  id,
  setDownloadData
) => {
  try {
    setLoading(true);
    const singleTrip = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/get-single-trip/${id}`
    );

    setTripDetails(singleTrip?.data?.data[0]);

    const generateMetadataObject = (requests, keyPrefix) => {
      const metadataKeys = requests?.joiningrequestmetadata
        ?.filter((requestData) => requestData?.key.startsWith(keyPrefix))
        ?.map((data, index) =>
          data.key.includes("kidAge")
            ? {
                [`${index + 1}عمر الطفل`]: data.value,
              }
            : data.key.includes("kidName")
            ? {
                [`${index + 1}اسم طفل`]: data.value,
              }
            : data.key.includes("AdultFirstName")
            ? {
                [`${index + 1}الاسم الأول للبالغين`]: data.value,
              }
            : data.key.includes("AdultLastName")
            ? {
                [`${index + 1}الاسم الأخير للبالغين`]: data.value,
              }
            : ""
        );

      return metadataKeys.reduce(
        (acc, metadata) => ({ ...acc, ...metadata }),
        {}
      );
    };
    const tripData = singleTrip?.data?.data[0]?.joiningRequests?.map(
      (requests) => {
        const agesObject = generateMetadataObject(requests, "kidAge");
        const kidsName = generateMetadataObject(requests, "kidName");
        const adultName = generateMetadataObject(requests, "AdultFirstName");
        const adultLastName = generateMetadataObject(requests, "AdultLastName");

        return {
          "الاسم الأول":
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "firstName"
            )?.value || "",
          "اسم العائلة":
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "lastName"
            )?.value || "",
          "حالة طلبات الانضمام": requests?.status || "",
          "بريد إلكتروني":
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "email"
            )?.value || "",
          "رقم الاتصال":
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "phone"
            )?.value || "",
          الكبار:
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "adults"
            )?.value || "",
          عمر:
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "age"
            )?.value || "",
          أطفال:
            requests?.joiningrequestmetadata?.find(
              (requestData) => requestData?.key === "kids"
            )?.value || "",
          ...agesObject,
          ...kidsName,
          ...adultName,
          ...adultLastName,
        };
      }
    );

    setDownloadData(tripData);

    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const userJoinRequest = async (
  token,
  tripRequest,
  router,
  setLoading,
  SetpersonalModalShow,
  setConfirmModalShow,
  organizerId,
  tripId,
  peopleValues,
  adultsValues
) => {
  try {
    setLoading(true);
    const obj = {};
    if (tripRequest?.id) {
      obj.id = tripRequest?.id;
    }
    if (tripRequest?.passport) {
      obj.passport = tripRequest?.passport;
    }
    if (tripRequest?.firstName) {
      obj.firstName = tripRequest?.firstName;
    }
    if (tripRequest?.lastName) {
      obj.lastName = tripRequest?.lastName;
    }
    if (tripRequest?.gender) {
      obj.gender = tripRequest?.gender;
    }
    if (tripRequest?.phone) {
      obj.phone = tripRequest?.phone;
    }
    if (tripRequest?.email) {
      obj.email = tripRequest?.email;
    }
    if (tripRequest?.healthIssues) {
      obj.healthIssues = tripRequest?.healthIssues;
    }

    if (tripRequest?.age) {
      obj.age = tripRequest?.age;
    }

    if (tripRequest?.adults) {
      obj.adults = tripRequest?.adults;
    }
    if (tripRequest?.kids) {
      obj.kids = tripRequest?.kids;
    }

    if (peopleValues?.length > 0) {
      for (let i = 0; i < peopleValues?.length; i++) {
        if (peopleValues[i].age) {
          obj[`kidAge${i + 1}`] = peopleValues[i].age;
        }
        if (peopleValues[i].name) {
          obj[`kidName${i + 1}`] = peopleValues[i].name;
        }
      }
    }

    if (adultsValues?.length > 0) {
      for (let i = 0; i < adultsValues?.length; i++) {
        if (adultsValues[i].firstName) {
          obj[`AdultFirstName${i + 1}`] = adultsValues[i].firstName;
        }
        if (adultsValues[i].lastName) {
          obj[`AdultLastName${i + 1}`] = adultsValues[i].lastName;
        }
      }
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/requests/create-joining-request`,
      {
        tripId: organizerId,

        fields: obj,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(response?.data?.message);
    SetpersonalModalShow(false);
    setConfirmModalShow(true);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const getAllUserRequest = async (
  setAllUserRequest,
  setLoading,
  setLimit,
  setTotalDocs,
  currentPage,
  token
) => {
  try {
    setLoading(true);
    const userRequest = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/requests/get-all-joining-request?page=${currentPage}&limit=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setAllUserRequest(userRequest?.data?.data?.docs);
    setTotalDocs(userRequest?.data?.data?.totalDocs);
    setLimit(userRequest?.data?.data?.limit);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const uploadUserInfo = async (
  token,
  file,
  setLoading,
  id,
  setIsOpen,
  setSelectedFile
) => {
  try {
    setLoading(true);
    const formData = new FormData();

    for (let i = 0; i < file?.length; i++) {
      if (file[i]) {
        formData.append("uploadImage", file[i]);
      }
    }
    if (file?.length != 0) {
      const userRequest = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/requests/upload-image/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedFile(null);
      toast.success(userRequest?.data?.message);
      setIsOpen(false);
      setLoading(false);
    } else {
      setIsOpen(false);
      setLoading(false);
      toast.error("الرجاء تحديد الملف");
    }
  } catch (err) {
    setLoading(false);
    setSelectedFile(null);
    setIsOpen(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const updateStatusFunction = async (
  token,
  id,
  status,
  setLoading,

  setIsOpen,
  setTripDetails,
  idData,
  OverlayAcceptSetIsOpen,
  OverlayRejectSetIsOpen,
  setDownloadData
) => {
  try {
    setLoading(true);

    const userRequest = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/organizers/update-joining-request/${id}`,
      {
        status: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(userRequest?.data?.message);
    getJoiningRequest(
      setTripDetails,
      setLoading,
      token,
      idData,
      setDownloadData
    );
    if (status === "Accepted") {
      OverlayAcceptSetIsOpen(true);
    } else {
      OverlayRejectSetIsOpen(true);
    }
    setIsOpen(false);
    setLoading(false);
  } catch (err) {
    setLoading(false);

    setIsOpen(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const statusChangedFunction = async (
  setTripDetails,
  token,
  id,
  router,
  setDownloadData,
  status,
  setLoading
) => {
  try {
    setLoading(true);
    let statusChanged = await axios.put(
      `${process.env.NEXT_PUBLIC_BASE_URL}/trips/update-trip-status/${id}`,
      {
        tripStatus: status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    getJoiningRequest(setTripDetails, setLoading, token, id, setDownloadData);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login?User=false");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};
export const getAllOrganizers = async (setLoading, router, setOptions) => {
  try {
    let allOrganizers = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/organizers/get-marketing-fields`
    );
    setOptions(
      allOrganizers?.data?.data?.map((organizer) => {
        return {
          label: organizer,
          value: organizer,
        };
      })
    );
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};
export const getSettingsData = async (
  setLoading,
  router,
  setHomeWebsiteData
) => {
  try {
    setLoading(true);
    let settingsData = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/admins/get-settings`
    );
    setHomeWebsiteData(settingsData?.data?.data);
    // console.log("settingsData",settingsData?.data?.data);
    setLoading(false);
  } catch (err) {
    setLoading(false);
    if (err?.response?.data?.message === "unAuthorized") {
      cookies.remove("token");
      cookies.remove("role");
      router.push("/admin/login");
    } else if (err?.response?.data?.message) {
      toast.error(err?.response?.data?.message);
    } else {
      toast.error("هناك خطأ ما!");
    }
  }
};

export const getAllFilterData = async (setFilterData) => {
  try {
    let filterData = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/filters/get-all-filters`
    );

    setFilterData(filterData?.data?.data);
  } catch (err) {
    toast.error("هناك خطأ ما!");
  }
};
