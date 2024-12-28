import React, { useState, useRef, useEffect } from "react";
import { api } from "../api";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface SushiOrder {
  name: string;
  product_code: string;
  quantity: number | null;
}

type ChatMode = "sushi" | "faq" | null;
type OrderStep = "variety" | "quantity" | "processing" | null;

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome! Choose an option:", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ChatMode>(null);
  const [orderStep, setOrderStep] = useState<OrderStep>(null);
  const [currentOrder, setCurrentOrder] = useState<SushiOrder>({
    name: "",
    product_code: "",
    quantity: null,
  });
  const [variety, setVariety] = useState<
    { name: string; product_code: string }[] | undefined
  >();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim() || mode !== "faq") return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: `Agent says: "${input}"`,
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, 500);

    setInput("");
  };

  const handleOptionClick = (selectedMode: ChatMode) => {
    setMode(selectedMode);
    if (selectedMode === "sushi") {
      setOrderStep("variety");
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: "Please select your sushi variety:",
          sender: "bot",
        },
      ]);
    } else if (selectedMode === "faq") {
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 1,
          text: "FAQ mode activated! Ask your question:",
          sender: "bot",
        },
      ]);
    }
  };

  const handleSushiVarietySelect = async (
    name: string,
    product_code: string
  ) => {
    setCurrentOrder({ ...currentOrder, name, product_code });
    setOrderStep("quantity");
    setMessages((prev) => [
      ...prev,
      { id: messages.length + 1, text: `Selected: ${name}`, sender: "user" },
      {
        id: messages.length + 2,
        text: "How many pieces would you like?",
        sender: "bot",
      },
    ]);
  };

  const handleQuantitySelect = async (quantity: number) => {
    setCurrentOrder({ ...currentOrder, quantity });
    setOrderStep("processing");

    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: `Quantity: ${quantity} pieces`,
        sender: "user",
      },
      {
        id: messages.length + 2,
        text: "Processing your order...",
        sender: "bot",
      },
    ]);

    try {
      const { data } = await api.post("/sushi/order", {
        product_code: currentOrder.product_code,
        quantity: currentOrder.quantity,
      });
      const { success } = data;

      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 3,
          text: `Order confirmed! Your ${quantity} pieces of ${currentOrder.name} will be prepared shortly.`,
          sender: "bot",
        },
        {
          id: messages.length + 4,
          text: "Would you like to order more sushi?",
          sender: "bot",
        },
      ]);
    } catch (error) {
      console.log(error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 3,
          text: "Sorry, we don't have enough stock for your order. Please try a different quantity or variety.",
          sender: "bot",
        },
      ]);
    }

    // Reset order state
    setOrderStep("variety");
    setCurrentOrder({ variety: "", quantity: null });
  };

  const handleReturnToMenu = () => {
    setMode(null);
    setInput("");
    setOrderStep(null);
    setCurrentOrder({ variety: "", quantity: null });
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: "Returning to main menu. Choose an option:",
        sender: "bot",
      },
    ]);
  };

  const getVarieties = async () => {
    try {
      const { data } = await api.get("/sushi/variety");
      const { stock } = data;
      setVariety(stock);
    } catch (e: any) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (orderStep === "variety") getVarieties();
  }, [orderStep]);

  return (
    <div className="flex flex-col h-[81vh]">
      {/* Message Display Area */}
      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 bg-white space-y-4 rounded-t-xl"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg max-w-xs w-fit shadow-md ${
              message.sender === "user"
                ? "bg-blue-500 text-white self-end text-right"
                : "bg-gray-200 text-black self-start text-left"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      {/* Main Menu */}
      <div className="flex-none">
        {mode === null && (
          <div className="p-4 bg-gray-200 flex space-x-4 rounded-b-xl">
            <button
              onClick={() => handleOptionClick("sushi")}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Buy Sushi
            </button>
            <button
              onClick={() => handleOptionClick("faq")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Ask the SushiBot 🍥
            </button>
          </div>
        )}

        {/* Sushi Mode - Variety Selection */}
        {mode === "sushi" && orderStep === "variety" && (
          <div className="p-4 bg-gray-200 flex space-x-4 rounded-b-xl">
            {variety?.map((v, i) => {
              return (
                <button
                  key={i}
                  onClick={() =>
                    handleSushiVarietySelect(v.name, v.product_code)
                  }
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  {v.name}
                </button>
              );
            })}
            <button
              onClick={handleReturnToMenu}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Return to Menu
            </button>
          </div>
        )}

        {/* Sushi Mode - Quantity Selection */}
        {mode === "sushi" && orderStep === "quantity" && (
          <div className="p-4 bg-gray-200 flex space-x-4 rounded-b-xl">
            {[2, 4, 6, 8].map((quantity) => (
              <button
                key={quantity}
                onClick={() => handleQuantitySelect(quantity)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                {quantity} pieces
              </button>
            ))}
            <button
              onClick={handleReturnToMenu}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Return to Menu
            </button>
          </div>
        )}

        {/* FAQ Mode */}
        {mode === "faq" && (
          <div className="p-4 bg-gray-200 flex items-center space-x-2 rounded-b-xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <button
              onClick={handleSend}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
            <button
              onClick={handleReturnToMenu}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Return to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
