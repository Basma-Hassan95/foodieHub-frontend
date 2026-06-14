import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { UserType } from "../UserContext";
  
  const ProfileScreen = () => {
    const { userId, setUserId, removeToken } = useContext(UserType);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
  
    useEffect(() => {
      const checkAuthAndFetchProfile = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          if (!token || !userId) {
            console.log("No auth credentials found");
            navigation.replace("Login");
            return;
          }
          await fetchUserProfile(token);
        } catch (error) {
          console.error("Auth check error:", error);
          handleSignOut();
        }
      };
  
      checkAuthAndFetchProfile();
    }, [userId]);
  
    const fetchUserProfile = async (token) => {
      try {
        const response = await fetch(`https://foodiehub-backend-production.up.railway.app/user/${userId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
  
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch profile");
        }
  
        setUserData(data);
  
      } catch (error) {
        console.error("Profile fetch error:", error);
        Alert.alert("Error", "Failed to load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    const handleSignOut = async () => {
      try {
        await removeToken();
        setUserId("");
        navigation.replace("Login");
      } catch (error) {
        console.error("Sign out error:", error);
        Alert.alert("Error", "Failed to sign out. Please try again.");
      }
    };
  
    const handleRefresh = async () => {
      setLoading(true);
      const token = await AsyncStorage.getItem("authToken");
      await fetchUserProfile(token);
    };
  
    const formatDate = (dateString) => {
      if (!dateString) return "Not set";
      return new Date(dateString).toLocaleDateString();
    };
  
    if (loading) {
      return (
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E67E22" />
          <Text style={styles.loadingText}>Loading your profile...</Text>
        </SafeAreaView>
      );
    }
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshing={loading}
          onRefresh={handleRefresh}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>My Profile</Text>
            <Pressable 
              onPress={handleSignOut} 
              style={styles.signOutButton}
            >
              <MaterialIcons name="logout" size={24} color="#FF3B30" />
              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>
  
          {userData && (
            <>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: userData.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
                  style={styles.profileImage}
                />
                <Text style={styles.username}>{userData.username}</Text>
              </View>
  
              <View style={styles.infoSection}>
                <InfoItem icon="user" label="Name" value={userData.username} />
                <InfoItem icon="envelope" label="Email" value={userData.email} />
                <InfoItem icon="venus-mars" label="Gender" value={userData.gender || "Not set"} />
                <InfoItem icon="calendar" label="Date of Birth" value={formatDate(userData.dateOfBirth)} />
                <InfoItem icon="map-marker" label="Address" value={userData.address || "Not set"} />
                <InfoItem icon="phone" label="Contact" value={userData.contactNumber || "Not set"} />
              </View>

              {/* Order History Button */}
              <Pressable 
                style={styles.orderHistoryButton}
                onPress={() => navigation.navigate("OrderHistory")}
              >
                <FontAwesome name="history" size={20} color="#fff" />
                <Text style={styles.orderHistoryButtonText}>Order History</Text>
              </Pressable>
  
              <Pressable 
                style={styles.editButton}
                onPress={() => navigation.navigate("EditProfile", { userData })}
              >
                <Text style={styles.editButtonText}>Edit Profile</Text>
              </Pressable>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const InfoItem = ({ icon, label, value }) => (
    <View style={styles.infoItem}>
      <FontAwesome name={icon} size={20} color="#666" style={styles.infoIcon} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#f5f5f5",
      paddingTop: 50,
    },
    scrollContent: {
      paddingBottom: 30,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f5f5f5",
    },
    loadingText: {
      marginTop: 10,
      color: "#666",
      fontSize: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    signOutButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
    },
    signOutText: {
      color: "#FF3B30",
      marginLeft: 5,
      fontSize: 16,
    },
    profileImageContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 10,
      backgroundColor: "#E1E1E1",
    },
    username: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#000",
    },
    infoSection: {
      backgroundColor: "#fff",
      borderRadius: 15,
      marginHorizontal: 20,
      padding: 15,
      marginBottom: 20,
      elevation: 2,
    },
    infoItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    infoIcon: {
      width: 30,
    },
    infoContent: {
      flex: 1,
      marginLeft: 10,
    },
    infoLabel: {
      fontSize: 14,
      color: "#666",
    },
    infoValue: {
      fontSize: 16,
      color: "#000",
      marginTop: 2,
    },
    orderHistoryButton: {
      backgroundColor: "#E67E22",
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      marginBottom: 12,
      elevation: 2,
    },
    orderHistoryButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },
    editButton: {
      backgroundColor: "#E67E22",
      marginHorizontal: 20,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      elevation: 2,
    },
    editButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
  });
  
  export default ProfileScreen;