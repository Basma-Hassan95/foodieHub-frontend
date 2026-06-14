import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/CartReducer";
import { UserType } from "../UserContext";

const categories = [
  {
    id: "1",
    name: "All",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200",
  },
  {
    id: "2",
    name: "Fast Food",
    image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=200",
  },
  {
    id: "3",
    name: "Pizza",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200",
  },
  {
    id: "4",
    name: "Chinese",
    image: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=200",
  },
  {
    id: "5",
    name: "Desi Food",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=200",
  },
];

const HomeScreen = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { userId, setUserId } = useContext(UserType);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const storedUserId = await AsyncStorage.getItem("userId");

      if (token) {
        const decodedToken = jwtDecode(token);
        if (decodedToken.userId) {
          setUserId(decodedToken.userId);
        } else if (storedUserId) {
          setUserId(storedUserId);
        }
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log("Error in fetchUser:", error);
    }
  };

  const fetchFoodItems = async () => {
    try {
      const response = await fetch("https://foodiehub-backend-production.up.railway.app/getAllFoods");
      if (!response.ok) throw new Error("Failed to fetch food items");
      const data = await response.json();
      setFoodItems(data.foodItems);
      setFilteredItems(data.foodItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to fetch food items");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchUser();
      await fetchFoodItems();
    };
    initialize();
  }, []);

  useEffect(() => {
    console.log("Current userId in context:", userId);
  }, [userId]);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchQuery("");
    if (categoryName === "All") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter(
        (item) =>
          item.category &&
          item.category.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredItems(filtered);
    }
  };

  const handleAddToCart = async (item) => {
    try {
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          dispatch(addToCart({ ...item, userId: storedUserId }));
          Alert.alert("Success", `${item.name} has been added to your cart.`);
        } else {
          Alert.alert("Error", "Please log in to add items to the cart.");
          navigation.navigate("Login");
        }
      } else {
        dispatch(addToCart({ ...item, userId }));
        Alert.alert("Success", `${item.name} has been added to your cart.`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleBuyNow = async (item) => {
    try {
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem("userId");
        if (storedUserId) {
          setUserId(storedUserId);
          dispatch(addToCart({ ...item, userId: storedUserId }));
          navigation.navigate("Cart", { userId: storedUserId });
        } else {
          Alert.alert("Error", "Please log in to proceed with purchase.");
          navigation.navigate("Login");
        }
      } else {
        dispatch(addToCart({ ...item, userId }));
        navigation.navigate("Cart", { userId });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to process purchase");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory("All");
    if (query === "") {
      setFilteredItems(foodItems);
    } else {
      const filtered = foodItems.filter((item) =>
        item.name && item.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.horizontalContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>
          <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.price}>Rs. {item.price}/=</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleAddToCart(item)}
          >
            <Text style={styles.buttonText}>Add to Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => handleBuyNow(item)}
          >
            <Text style={styles.buttonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E67E22" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search for food..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => handleCategorySelect(cat.name)}
            >
              <View
                style={[
                  styles.categoryImageWrapper,
                  selectedCategory === cat.name &&
                    styles.categoryImageWrapperActive,
                ]}
              >
                <Image
                  source={{ uri: cat.image }}
                  style={styles.categoryImage}
                />
              </View>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.name && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Food Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found!</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    backgroundColor: "#E67E22",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    width: "90%",
    height: 40,
    borderColor: "#E67E22",
    borderWidth: 1,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 8,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  categoriesWrapper: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 70,
  },
  categoryImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E0E0E0",
  },
  categoryImageWrapperActive: {
    borderColor: "#E67E22",
    borderWidth: 3,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryText: {
    marginTop: 5,
    fontSize: 11,
    color: "#757575",
    textAlign: "center",
  },
  categoryTextActive: {
    color: "#E67E22",
    fontWeight: "bold",
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    padding: 10,
    minHeight: 130,
  },
  horizontalContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 8,
  },
  infoContainer: {
    flex: 2,
    marginLeft: 10,
    justifyContent: "space-between",
    paddingRight: 5,
  },
  foodName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#212121",
  },
  category: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: "#616161",
    marginBottom: 2,
    numberOfLines: 2,
  },
  price: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#E67E22",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#F39C12",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    width: 80,
  },
  button1: {
    backgroundColor: "#E67E22",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
    width: 80,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
  },
});

export default HomeScreen;