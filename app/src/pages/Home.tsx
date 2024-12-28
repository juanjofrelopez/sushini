import Chatbot from "../components/Chatbot";

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto overflow-hidden">
      <h1 className="text-3xl font-bold mt-4 mb-4">Welcome to Sushi Chat</h1>
      <Chatbot />
    </div>
  );
};

export default Home;