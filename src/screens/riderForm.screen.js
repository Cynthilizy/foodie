import React, { useState, useContext, useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import { Picker } from "@react-native-picker/picker";
import { AccountBackground, Title } from "../stylings/account.styles";
import { Text } from "../styles/text.styles";
import { Spacer } from "../styles/spacer.styles";
import { saveRiderDataToFirestore } from "../service/firestore.service";
import { AuthenticationContextRider } from "../context/authenticationRider.context";
import {
  Alert,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Image,
  Button,
} from "react-native";
import { storage } from "../service/firebase.service";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import styled from "styled-components/native";
import { db } from "../service/firebase.service";
import { doc, onSnapshot } from "firebase/firestore";
import { TabLink } from "../stylings/restaurant-info.styles";
import { ScrollView } from "react-native";

const isValidEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

const ProfileCamera = styled(Camera)`
  flex: 1;
`;

const CameraButton = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  margin: 20px;
  justify-content: center;
  align-items: flex-end;
`;

export const RidersForm = ({ route, navigation }) => {
  const { phoneRiderNumber } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [username, setUsername] = useState("");
  const [emailRider, setEmailRider] = useState("");
  const [description, setDescription] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const [showNow, setShowNow] = useState(false);
  const [idDocument, setIdDocument] = useState({ front: null, back: null });
  const [documentType, setDocumentType] = useState("");

  const {
    rider,
    setProfilePicUrlRider,
    isLoadingRider,
    recheckAuthenticationRider,
    profilePicUrlRider,
  } = useContext(AuthenticationContextRider);

  const cameraRef = useRef();

  const isUsernameValid = username.length >= 3;
  const isDocumentTypeValid = documentType !== "";
  const isEmailValid = isValidEmail(emailRider);
  const MIN_DESCRIPTION_LENGTH = 10;
  const MAX_DESCRIPTION_LENGTH = 200;
  const isDescriptionValid =
    description.length >= MIN_DESCRIPTION_LENGTH &&
    description.length <= MAX_DESCRIPTION_LENGTH;

  const isIdDocumentValid =
    idDocument.front !== null && idDocument.back !== null;
  const isProfilePicValid =
    profilePicUrlRider !== null && profilePicUrlRider !== "";

  const isFormValid =
    isUsernameValid &&
    isEmailValid &&
    isDescriptionValid &&
    isIdDocumentValid &&
    isProfilePicValid &&
    isDocumentTypeValid;

  useEffect(() => {
    if (isLoadingRider) {
      setShowLoading(true);
    } else {
      setShowLoading(false);
    }
  }, [isLoadingRider]);

  const handleSubmit = async () => {
    if (!isFormValid) {
      Alert.alert("Warning", "Please check all fields are correct.", [
        { text: "OK", onPress: () => {} },
      ]);
      return;
    }
    try {
      setShowLoading(true); // <-- Set loading to true
      const riderData = {
        nameRider: username,
        emailRider: emailRider,
        phoneRider: phoneRiderNumber,
        profilePictureRider: profilePicUrlRider,
        riderStatus: "Pending",
        role: "rider",
        earnings: "",
        aboutRider: description,
        document: {
          front: idDocument.front,
          back: idDocument.back,
          type: documentType,
        },
        riderOnline: false,
      };
      await saveRiderDataToFirestore(phoneRiderNumber, riderData);
      await recheckAuthenticationRider(phoneRiderNumber);
      navigation.navigate("Verifying");
    } catch (error) {
      console.error("Error while handling submit:", error);
    } finally {
      setShowLoading(false);
    }
  };

  const openImagePicker = async (type) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    setShowLoading(true);
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (
      !pickerResult.canceled &&
      pickerResult.assets &&
      pickerResult.assets.length > 0
    ) {
      const { uri } = pickerResult.assets[0];
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const ref = storageRef(
          storage,
          `document_pictures/riders/${type}_${phoneRiderNumber}`
        );
        await uploadBytes(ref, blob);
        const downloadURL = await getDownloadURL(ref);
        console.log("File available at", downloadURL);
        setIdDocument((prevState) => ({
          ...prevState,
          [type]: downloadURL,
        }));
        setShowLoading(false);
      } catch (error) {
        console.error("Error with picking image and uploading:", error);
      }
    }
  };

  const showAcceptedDocumentTypes = () => {
    Alert.alert(
      "Accepted Document Types",
      "Driver License, National ID, Passport, Voters Card",
      [{ text: "OK", onPress: () => {} }],
      { cancelable: true }
    );
  };

  const snap = async () => {
    if (cameraRef) {
      const photo = await cameraRef.current.takePictureAsync();
      const response = await fetch(photo.uri);
      const blob = await response.blob();
      const ref = storageRef(
        storage,
        `profile_pictures/riders/${rider.phoneNumberRider}`
      );
      setTimeout(() => setShowLoading(true), 500);

      uploadBytes(ref, blob)
        .then(async (snapshot) => {
          const downloadURL = await getDownloadURL(ref);
          console.log("File available at", downloadURL);
          setProfilePicUrlRider(downloadURL);
          setShowLoading(false);
          setShowNow(false);
        })
        .catch((error) => {
          console.error("Error with Firebase Storage:", error);
        });
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const ShowCam = () => {
    return (
      <ProfileCamera
        ref={(camera) => (cameraRef.current = camera)}
        type={Camera.Constants.Type.front}
      >
        {!showLoading ? (
          <CameraButton>
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderRadius: 50,
                borderColor: "white",
                height: 50,
                width: 50,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#3498db",
              }}
              onPress={() => {
                //setShowLoading(true);
                snap();
              }}
            >
              <View
                style={{
                  borderWidth: 2,
                  borderRadius: 50,
                  borderColor: "white",
                  height: 40,
                  width: 40,
                  backgroundColor: "white",
                }}
              ></View>
            </TouchableOpacity>
          </CameraButton>
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size={50} animating={true} color="#3498db" />
          </View>
        )}
        <Spacer />
      </ProfileCamera>
    );
  };

  return (
    <TabLink>
      {showNow && <ShowCam />}
      {!showNow && (
        <ScrollView>
          <Title style={{ textAlign: "center" }}>Welcome To Foodie Rider</Title>
          <Text style={{ textAlign: "center" }}>
            Complete your profile and upload required documents
          </Text>
          <Spacer position="top" size="xl" />
          <Text variant="label" style={{ textAlign: "center" }}>
            Click{" "}
            <Text
              onPress={showAcceptedDocumentTypes}
              style={styles.acceptedDocsText}
            >
              HERE
            </Text>{" "}
            to see a list of our accepted documents
          </Text>
          <Spacer position="top" size="large" />
          <View style={styles.container}>
            {!isUsernameValid && (
              <Text variant="error">! Username must be above 3 characters</Text>
            )}
            <TextInput
              style={[styles.input, !isUsernameValid && styles.invalidInput]}
              placeholder="Enter Your Full Name Here"
              value={username}
              onChangeText={setUsername}
            />
            {!isEmailValid && (
              <Text variant="error">! Give valid email format</Text>
            )}
            <TextInput
              style={[styles.input, !isEmailValid && styles.invalidInput]}
              placeholder="email"
              value={emailRider}
              onChangeText={setEmailRider}
            />
            {!isDescriptionValid && (
              <Text variant="error">example your current or previous jobs</Text>
            )}
            <TextInput
              style={[styles.input, !isDescriptionValid && styles.invalidInput]}
              placeholder="Tell us about yourself"
              value={description}
              onChangeText={setDescription}
              maxLength={MAX_DESCRIPTION_LENGTH}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowNow(true)}
            >
              <Text style={styles.buttonText}>Click To Take a Picture</Text>
            </TouchableOpacity>
            {!isProfilePicValid && (
              <Text variant="error">please upload a clear front picture</Text>
            )}
            {profilePicUrlRider && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: profilePicUrlRider }}
                  style={styles.image}
                />
              </View>
            )}
            <Spacer />
            {!isIdDocumentValid && (
              <Text variant="error">
                ! please upload both front and back images of your document
              </Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={() => openImagePicker("front")}
            >
              <Text style={styles.buttonText}>
                Upload The Front View Of Your Valid ID Card
              </Text>
            </TouchableOpacity>
            {idDocument.front && (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: idDocument.front }}
                  style={styles.image}
                />
              </View>
            )}
            {!isIdDocumentValid && (
              <Text variant="error">
                ! please upload both front and back images of your document
              </Text>
            )}
            <Spacer />
            <TouchableOpacity
              style={styles.button}
              onPress={() => openImagePicker("back")}
            >
              <Text style={styles.buttonText}>
                Upload The Back View Of Your Valid ID Card
              </Text>
            </TouchableOpacity>

            {idDocument.back && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: idDocument.back }} style={styles.image} />
              </View>
            )}
            <Spacer size="large">
              {!isDocumentTypeValid && (
                <Text variant="error">
                  ! select the type of document you have uploaded
                </Text>
              )}
              <Picker
                selectedValue={documentType}
                onValueChange={(itemValue) => setDocumentType(itemValue)}
              >
                <Picker.Item label="Select Document Type" value="" />
                <Picker.Item label="Driver License" value="Driver License" />
                <Picker.Item label="National ID" value="National ID" />
                <Picker.Item label="Passport" value="Passport" />
                <Picker.Item label="Voters Card" value="Voters Card" />
              </Picker>
              {!showLoading ? (
                <Button
                  title="Continue Registeration"
                  icon="lock-open-outline"
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={!isFormValid}
                />
              ) : (
                <ActivityIndicator size={25} animating={true} color="#0000FF" />
              )}
            </Spacer>
          </View>
          <Spacer size="large">
            <Button
              title="Cancel"
              mode="contained"
              onPress={() => navigation.navigate("Main")}
            />
          </Spacer>
        </ScrollView>
      )}
    </TabLink>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  invalidInput: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  acceptedDocsText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#3498db",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 15,
  },
});
