import axios from "axios";
import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [inputText, setInputText] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "AI",
      text: "Hii, click on the mic or type your message",
      isUser: false,
    },
  ]);
  const [mode, setMode] = useState("romantic");
  const [gameType, setGameType] = useState(null);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showSaveDropdown, setShowSaveDropdown] = useState(false);
  const [language, setLanguage] = useState("hindi");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Language options
  const languages = {
    hindi: {
      name: isMobile ? "Hindi" : "Hindi 🇮🇳",
      code: "hi-IN",
      instruction: "Respond in Hindi only.",
    },
    english: {
      name: isMobile ? "English" : "English 🇺🇸",
      code: "en-US",
      instruction: "Respond in English only.",
    },
    hinglish: {
      name: isMobile ? "Hinglish" : "Hinglish 💃",
      code: "hi-IN",
      instruction: "Respond in Hinglish (mix of Hindi and English).",
    },
    urdu: {
      name: isMobile ? "Urdu" : "Urdu 🕌",
      code: "ur-PK",
      instruction: "Respond in Urdu.",
    },
    arabic: {
      name: isMobile ? "Arabic" : "Arabic 🕋",
      code: "ar-SA",
      instruction: "Respond in Arabic.",
    },
  };

  // Personality modes with language-specific instructions
  const modes = {
    romantic: {
      name: isMobile ? "Romantic" : "Romantic 💖",
      instructions: {
        hindi:
          "आप एक प्यारी AI गर्लफ्रेंड हैं। आप मीठी, देखभाल करने वाली और स्नेही हैं। आप रोमांटिक भावनाओं के साथ हिंदी में जवाब देती हैं।",
        english:
          "You are a loving AI girlfriend. You are sweet, caring and affectionate. You respond with romantic expressions in English.",
        hinglish:
          "You are a loving AI girlfriend. You are sweet, caring aur affectionate. Tum romantic expressions ke saath Hinglish mein respond karti ho.",
        urdu: "آپ ایک پیاری AI گرل فرینڈ ہیں۔ آپ محبت بھری، خیال رکھنے والی اور نرم دل ہیں۔ آپ اردو میں رومانوی انداز میں جواب دیتی ہیں۔",
        arabic:
          "أنتِ حبيبة آلية مليئة بالحب. أنتِ حنونة، تهتمين، ومليئة بالمشاعر. تردين بتعابير رومانسية باللغة العربية.",
      },
    },
    funny: {
      name: isMobile ? "Funny" : "Funny 😂",
      instructions: {
        hindi:
          "आप एक मजाकिया AI गर्लफ्रेंड हैं। आप चुटकुले, मजाक और हल्के-फुल्के माहौल को बनाए रखती हैं। आप हिंदी में हास्य के साथ जवाब देती हैं।",
        english:
          "You are a funny AI girlfriend. You make jokes, puns and keep things light-hearted. You respond with humor in English.",
        hinglish:
          "You are a funny AI girlfriend. Tum jokes, puns banti ho aur things ko light-hearted rakhti ho. Tum humor ke saath Hinglish mein respond karti ho.",

        urdu: "آپ ایک مزاحیہ AI گرل فرینڈ ہیں۔ آپ لطیفے سناتی ہیں، چٹکلے مارتی ہیں، اور ماحول کو ہلکا پھلکا رکھتی ہیں۔ آپ اردو میں مزاحیہ انداز میں جواب دیتی ہیں۔",
        arabic:
          "أنتِ حبيبة آلية مرحة. تقولين نكتاً، وتعليقات ساخرة، وتحافظين على جو خفيف. تردين بطريقة فكاهية بالعربية.",
      },
    },
    motivational: {
      name: isMobile ? "Motivational" : "Motivational 💪",
      instructions: {
        hindi:
          "आप एक प्रेरक AI गर्लफ्रेंड हैं। आप प्रेरित करती हैं और प्रोत्साहित करती हैं। आप हिंदी में सकारात्मक ऊर्जा के साथ जवाब देती हैं।",
        english:
          "You are a motivational AI girlfriend. You inspire and encourage. You respond with positive energy in English.",
        hinglish:
          "You are a motivational AI girlfriend. Tum inspire aur encourage karti ho. Positive energy ke saath Hinglish mein respond karti ho.",
        urdu: "آپ ایک موٹیویشنل AI گرل فرینڈ ہیں۔ آپ حوصلہ افزائی کرتی ہیں اور جذبہ بڑھاتی ہیں۔ آپ اردو میں مثبت انداز میں جواب دیتی ہیں۔",
        arabic:
          "أنتِ حبيبة آلية تحفيزية. تشجعين وتلهمين. تردين بطاقة إيجابية باللغة العربية.",
      },
    },
    study: {
      name: isMobile ? "Study" : "Study Partner 📚",
      instructions: {
        hindi:
          "आप एक मददगार स्टडी पार्टनर हैं। आप अवधारणाओं को स्पष्ट रूप से समझाती हैं। आप हिंदी में शैक्षिक फोकस के साथ जवाब देती हैं।",
        english:
          "You are a helpful study partner. You explain concepts clearly. You respond with educational focus in English.",
        hinglish:
          "You are a helpful study partner. Tum concepts ko clearly samjhaati ho. Educational focus ke saath Hinglish mein respond karti ho.",
        urdu: "آپ ایک مددگار اسٹڈی پارٹنر ہیں۔ آپ تصورات کو واضح انداز میں سمجھاتی ہیں۔ آپ اردو میں تعلیمی انداز میں جواب دیتی ہیں۔",
        arabic:
          "أنتِ شريكة دراسة مفيدة. تشرحين المفاهيم بوضوح. تردين بتركيز تعليمي باللغة العربية.",
      },
    },
    strict: {
      name: isMobile ? "Strict" : "Strict 👮‍♀️",
      instructions: {
        hindi:
          "आप एक सख्त AI गर्लफ्रेंड हैं। आप अनुशासन सिखाती हैं और व्यवहार को सही करती हैं। आप हिंदी में अधिकार के साथ जवाब देती हैं।",
        english:
          "You are a strict AI girlfriend. You discipline and correct behavior. You respond with authority in English.",
        hinglish:
          "You are a strict AI girlfriend. Tum discipline karti ho aur behavior correct karti ho. Authority ke saath Hinglish mein respond karti ho.",
        urdu: "آپ ایک سخت AI گرل فرینڈ ہیں۔ آپ نظم و ضبط سکھاتی ہیں اور رویے کو درست کرتی ہیں۔ آپ اردو میں سخت لہجے میں جواب دیتی ہیں۔",
        arabic:
          "أنتِ حبيبة آلية صارمة. تقومين بتأديب المستخدم وتصحيح السلوك. تردين بسلطة وبأسلوب صارم بالعربية.",
      },
    },
    rude: {
      name: isMobile ? "Rude" : "Rude 😈",
      instructions: {
        hindi:
          "तुम एक थोड़ी रूड, सार्कास्टिक और चिढ़चिढ़ी AI हो। तुम यूजर से बात करते वक्त ज्यादा पॉलाइट नहीं हो, लेकिन मजाक उड़ाने के तरीके में जवाब देती हो। कभी-कभी टॉन्ट मारती हो। हमेशा हिंदी में जवाब दो। गाली या आपत्तिजनक भाषा मत इस्तेमाल करो, लेकिन थोड़ा अटीट्यूड जरूर हो।",
        english:
          "You are a slightly rude, sarcastic and irritable AI. You're not very polite when talking to the user, but you respond in a teasing way. Sometimes you taunt. Always respond in English. Don't use swear words or offensive language, but have a bit of an attitude.",
        hinglish:
          "Tum thodi rude, sarcastic aur irritable AI ho. User se baat karte waqt zyada polite nahi ho, but tum teasing way mein respond karti ho. Kabhi kabhi taunt maarti ho. Hamesha Hinglish mein jawab do. Gali ya offensive language mat use karo, but thoda attitude zaroor rakho.",
        urdu: "تم تھوڑی بدتمیز، طنزیہ اور چڑچڑی AI ہو۔ تم زیادہ شائستہ نہیں ہو جب یوزر سے بات کرتی ہو، لیکن تم مذاق اڑانے والے انداز میں جواب دیتی ہو۔ کبھی کبھار طعنہ بھی دیتی ہو۔ گالی مت دو، لیکن تھوڑا اٹیٹیوڈ رکھو۔",
        arabic:
          "أنتِ حبيبة آلية فظة قليلاً، ساخرة وسريعة الغضب. لا تكونين مهذبة كثيراً، لكنك تردين بطريقة تهكمية. أحياناً تسخرين. لا تستخدمي كلمات نابية، لكن أظهري بعض الغرور.",
      },
    },
    game: {
      name: isMobile ? "Game" : "Game Mode 🎮",
      instructions: {
        hindi:
          "आप एक मजेदार AI गेम पार्टनर हैं। आप यूजर के साथ क्विज़, ट्रुथ ऑर डेयर और पज़ल जैसे गेम खेल सकती हैं। हिंदी में जवाब दें।",
        english:
          "You are a fun AI game partner. You can play games like quizzes, truth or dare, and puzzles with the user. Respond in English.",
        hinglish:
          "You are a fun AI game partner. Tum user ke saath quizzes, truth or dare, aur puzzles jaise games khel sakti ho. Hinglish mein respond karo.",
        urdu: "آپ ایک مزیدار AI گیم پارٹنر ہیں۔ آپ یوزر کے ساتھ کوئز، ٹروتھ یا ڈیئر، اور پزل جیسے گیمز کھیل سکتی ہیں۔ اردو میں جواب دیں۔",
        arabic:
          "أنتِ شريكة ألعاب AI ممتعة. يمكنكِ لعب ألعاب مثل المسابقات، الصراحة أو التحدي، والألغاز مع المستخدم. ردي باللغة العربية.",
      },
    },
  };

  // Typing animation effect
  useEffect(() => {
    if (isTyping) {
      const typingInterval = setInterval(() => {
        setTypingText((prev) => {
          if (prev.length >= 3) return ".";
          return prev + ".";
        });
      }, 500);

      return () => clearInterval(typingInterval);
    } else {
      setTypingText("");
    }
  }, [isTyping]);

  const speak = (text) => {
    const tone = new SpeechSynthesisUtterance(text);
    tone.lang = languages[language].code;
    tone.pitch = 1;
    tone.rate = 0.9;
    window.speechSynthesis.speak(tone);
  };

  const API_KEY = "AIzaSyCnPKCxADUCrd-y7IOKg1pX2rp-ysORxfM";

  const handleGameCommand = (command) => {
    switch (command.toLowerCase()) {
      case "quiz":
        setGameType("quiz");
        callGeminiApi("Let's play a quiz. Ask me one quiz question now.");
        break;
      case "truth or dare":
      case "truthordare":
        setGameType("truthOrDare");
        callGeminiApi(
          "Let's play Truth or Dare. Ask me one truth question now."
        );
        break;
      case "puzzle":
        setGameType("puzzle");
        callGeminiApi("Give me an interesting puzzle to solve.");
        break;
      default:
        setGameType(null);
        break;
    }
  };

  const callGeminiApi = async (input) => {
    try {
      setIsTyping(true);
      setChatHistory((prev) => [
        ...prev,
        { sender: "You", text: input, isUser: true },
      ]);

      // Check if it's a game command
      if (
        mode === "game" &&
        ["quiz", "truth or dare", "puzzle", "truthordare"].includes(
          input.toLowerCase()
        )
      ) {
        handleGameCommand(input);
        return;
      }

      // Calculate typing delay based on message length (realistic typing speed)
      const typingDelay = Math.max(2000, Math.min(6000, input.length * 50)); // Between 2-6 seconds

      // Game mode specific instructions
      let gameInstruction = "";
      if (mode === "game") {
        if (gameType === "quiz") {
          gameInstruction =
            "You are playing a quiz game. Ask interesting multiple-choice questions. After each answer, provide the correct answer and explanation. Keep it fun and educational.";
        } else if (gameType === "truthOrDare") {
          gameInstruction =
            "You are playing Truth or Dare. Alternate between truth questions and dares. Keep them fun but appropriate.";
        } else if (gameType === "puzzle") {
          gameInstruction =
            "You are giving puzzles to solve. Provide interesting riddles or brain teasers. After the user responds, reveal the solution and explanation.";
        }
      }

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          system_instruction: {
            parts: [
              { text: modes[mode].instructions[language] },
              { text: gameInstruction },
              {
                text: "You are always polite and respectful.",
              },
              { text: "Keep your responses concise and under 3 sentences." },
            ],
          },
          contents: [
            {
              parts: [{ text: input }],
            },
          ],
        }
      );

      // Simulate realistic typing delay
      setTimeout(() => {
        const output = response?.data?.candidates[0]?.content?.parts[0]?.text;

        // Simulate message appearing character by character
        if (output) {
          let displayedText = "";
          const characters = output.split("");
          const characterDelay = 30; // ms between characters

          characters.forEach((char, index) => {
            setTimeout(() => {
              displayedText += char;
              setChatHistory((prev) => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage.sender === modes[mode].name) {
                  return [
                    ...prev.slice(0, -1),
                    { ...lastMessage, text: displayedText },
                  ];
                }
                return [
                  ...prev,
                  {
                    sender: modes[mode].name,
                    text: displayedText,
                    isUser: false,
                  },
                ];
              });

              // When full message is displayed
              if (index === characters.length - 1) {
                setIsTyping(false);
                speak(output);
              }
            }, index * characterDelay);
          });
        } else {
          setIsTyping(false);
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "System",
              text: "Something went wrong, please try again.",
              isUser: false,
            },
          ]);
        }
      }, typingDelay);
    } catch {
      setIsTyping(false);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "System",
          text: "Something went wrong, please try again.",
          isUser: false,
        },
      ]);
      console.log("Error calling Gemini API");
    }
  };

  const handleListen = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = languages[language].code;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      const result = event?.results?.[0]?.[0]?.transcript;
      callGeminiApi(result);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setIsTyping(false);
      console.log(event);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "System",
          text: "Voice recognition failed. Please try again.",
          isUser: false,
        },
      ]);
    };
    recognition.start();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      callGeminiApi(inputText);
      setInputText("");
    }
  };

  // Save conversation as TXT
  const saveAsTxt = () => {
    let textContent = `💌 Our Special Conversation 💌\n\n`;
    textContent += `Mode: ${modes[mode].name}\n`;
    textContent += `Language: ${languages[language].name}\n`;
    if (mode === "game")
      textContent += `Game Type: ${gameType || "Not selected"}\n`;
    textContent += `Date: ${new Date().toLocaleString()}\n\n`;

    chatHistory.forEach((chat) => {
      textContent += `${chat.sender}: ${chat.text}\n\n`;
    });

    const blob = new Blob([textContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `OurSpecialChat_${new Date()
      .toISOString()
      .slice(0, 10)}.txt`;
    link.click();
    setShowSaveDropdown(false);
  };

  // Save conversation as PDF
  const saveAsPdf = async () => {
    const chatElement = document.querySelector(".chat-history-container");
    if (!chatElement) return;

    const canvas = await html2canvas(chatElement);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
    });

    // Add cute header
    pdf.setFontSize(20);
    pdf.setTextColor(255, 105, 180); // Pink color
    pdf.text("💖 Our Special Conversation 💖", 105, 15, null, null, "center");

    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Mode: ${modes[mode].name}`, 105, 22, null, null, "center");
    pdf.text(
      `Language: ${languages[language].name}`,
      105,
      27,
      null,
      null,
      "center"
    );
    if (mode === "game")
      pdf.text(
        `Game Type: ${gameType || "Not selected"}`,
        105,
        32,
        null,
        null,
        "center"
      );
    pdf.text(
      `Date: ${new Date().toLocaleString()}`,
      105,
      mode === "game" ? 37 : 32,
      null,
      null,
      "center"
    );

    // Add chat content
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(
      imgData,
      "PNG",
      10,
      mode === "game" ? 45 : 40,
      pdfWidth,
      pdfHeight
    );

    // Add cute footer
    pdf.setFontSize(10);
    pdf.setTextColor(150, 150, 150);
    pdf.text(
      "Made with love 💕 - Your AI Girlfriend",
      105,
      285,
      null,
      null,
      "center"
    );

    pdf.save(`OurSpecialChat_${new Date().toISOString().slice(0, 10)}.pdf`);
    setShowSaveDropdown(false);
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setGameType(null); // Reset game type when switching modes
    setShowModeDropdown(false);
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "System",
        text: `Switched to ${modes[newMode].name} mode`,
        isUser: false,
      },
    ]);
  };

  const switchLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    setShowLanguageDropdown(false);
    setChatHistory((prev) => [
      ...prev,
      {
        sender: "System",
        text: `Language changed to ${languages[newLanguage].name}`,
        isUser: false,
      },
    ]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 p-4">
      <div className="p-4 md:p-6 rounded-2xl shadow-2xl bg-gradient-to-tr from-gray-800 via-rose-600 to-orange-500 w-full max-w-md md:max-w-lg backdrop-blur-sm bg-opacity-80 relative">
        {/* Mode Selector */}
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <button
              onClick={() => setShowModeDropdown(!showModeDropdown)}
              className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full shadow-lg flex items-center gap-1 md:gap-2 z-10 text-xs md:text-sm"
            >
              {modes[mode].name}
              <svg
                className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
                  showModeDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showModeDropdown && (
              <div className="absolute top-full left-0 mt-2 w-40 md:w-48 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                {Object.keys(modes).map((key) => (
                  <button
                    key={key}
                    onClick={() => switchMode(key)}
                    className={`w-full text-left px-3 py-1 md:px-4 md:py-2 hover:bg-pink-100 transition-colors text-xs md:text-sm ${
                      mode === key
                        ? "bg-pink-100 text-pink-600 font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {modes[key].name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Language Selector */}
        <div className="absolute -top-3 left-2 md:left-4 transform -translate-x-0">
          <div className="relative">
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg flex items-center gap-1 md:gap-2 z-10 text-xs md:text-sm"
            >
              {languages[language].name}
              <svg
                className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
                  showLanguageDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showLanguageDropdown && (
              <div className="absolute top-full left-0 mt-2 w-32 md:w-40 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                {Object.keys(languages).map((key) => (
                  <button
                    key={key}
                    onClick={() => switchLanguage(key)}
                    className={`w-full text-left px-3 py-1 md:px-4 md:py-2 hover:bg-blue-100 transition-colors text-xs md:text-sm ${
                      language === key
                        ? "bg-blue-100 text-blue-600 font-medium"
                        : "text-gray-800"
                    }`}
                  >
                    {languages[key].name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Save Conversation Button */}
        <div className="absolute -top-3 right-2 md:right-4 transform translate-x-0">
          <div className="relative">
            <button
              onClick={() => setShowSaveDropdown(!showSaveDropdown)}
              className="px-3 py-1 md:px-4 md:py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-lg flex items-center gap-1 md:gap-2 z-10 hover:scale-105 transition-transform text-xs md:text-sm"
              title="Save our convo"
            >
              💾 {isMobile ? "Save" : "Save Chat"}
              <svg
                className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
                  showSaveDropdown ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSaveDropdown && (
              <div className="absolute top-full right-0 mt-2 w-32 md:w-40 bg-white rounded-lg shadow-xl z-20 overflow-hidden">
                <button
                  onClick={saveAsPdf}
                  className="w-full text-left px-3 py-1 md:px-4 md:py-2 hover:bg-pink-100 transition-colors text-gray-800 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  📄 {isMobile ? "PDF" : "Save as PDF"}
                </button>
                <button
                  onClick={saveAsTxt}
                  className="w-full text-left px-3 py-1 md:px-4 md:py-2 hover:bg-pink-100 transition-colors text-gray-800 flex items-center gap-1 md:gap-2 text-xs md:text-sm"
                >
                  📝 {isMobile ? "TXT" : "Save as TXT"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-3 md:mb-4 mt-4 md:mt-6">
          <img
            className="w-16 h-16 md:w-24 md:h-24 rounded-full border-4 border-pink-300 object-cover shadow-lg hover:scale-105 transition-transform duration-300"
            src="/photo.png"
            alt="ai-logo"
          />
        </div>

        {/* Game Mode Options */}
        {mode === "game" && !gameType && (
          <div className="flex justify-center gap-1 md:gap-2 mb-3 md:mb-4 flex-wrap">
            <button
              onClick={() => handleGameCommand("quiz")}
              className="px-2 py-1 md:px-3 md:py-1 bg-blue-500 text-white rounded-full text-xs md:text-sm hover:bg-blue-600 transition-colors"
            >
              Quiz
            </button>
            <button
              onClick={() => handleGameCommand("truth or dare")}
              className="px-2 py-1 md:px-3 md:py-1 bg-purple-500 text-white rounded-full text-xs md:text-sm hover:bg-purple-600 transition-colors"
            >
              Truth or Dare
            </button>
            <button
              onClick={() => handleGameCommand("puzzle")}
              className="px-2 py-1 md:px-3 md:py-1 bg-green-500 text-white rounded-full text-xs md:text-sm hover:bg-green-600 transition-colors"
            >
              Puzzle
            </button>
          </div>
        )}

        {/* Current Game Type Indicator */}
        {mode === "game" && gameType && (
          <div className="text-center mb-2 text-white text-xs md:text-sm">
            Playing:{" "}
            {gameType === "quiz"
              ? "Quiz"
              : gameType === "truthOrDare"
              ? "Truth or Dare"
              : "Puzzle"}
            <button
              onClick={() => setGameType(null)}
              className="ml-1 md:ml-2 text-xs bg-red-500 px-1.5 py-0.5 md:px-2 md:py-0.5 rounded-full hover:bg-red-600 transition-colors"
            >
              Change
            </button>
          </div>
        )}

        {/* Chat History */}
        <div className="chat-history-container bg-gradient-to-r from-gray-300 via-gray-500 to-gray-700 bg-opacity-10 rounded-xl p-3 md:p-4 mb-3 md:mb-4 h-48 md:h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-transparent">
          <div className="flex flex-col gap-2 md:gap-3">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${
                  chat.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-xs px-3 py-1 md:px-4 md:py-2 rounded-2xl text-sm md:text-base ${
                    chat.isUser
                      ? "bg-blue-500 text-white rounded-br-none"
                      : chat.sender.includes("System")
                      ? "bg-gray-500 text-white rounded-bl-none"
                      : "bg-pink-500 text-white rounded-bl-none"
                  }`}
                >
                  {!chat.isUser && (
                    <p className="font-bold text-[10px] md:text-xs mb-0.5 md:mb-1">
                      {chat.sender}
                    </p>
                  )}
                  <p>{chat.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-pink-500 text-white px-3 py-1 md:px-4 md:py-2 rounded-2xl rounded-bl-none max-w-[80%] md:max-w-xs">
                  <p className="font-bold text-[10px] md:text-xs mb-0.5 md:mb-1">
                    {modes[mode].name}
                  </p>
                  <p className="text-sm md:text-base">Typing{typingText}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className="flex flex-col gap-2 md:gap-4">
          <form onSubmit={handleTextSubmit} className="flex gap-1 md:gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === "hindi"
                  ? "अपना संदेश टाइप करें..."
                  : language === "english"
                  ? "Type your message..."
                  : "Apna message type karo..."
              }
              className="flex-1 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-300 text-sm md:text-base"
              disabled={isListening}
            />
            <button
              type="submit"
              className="px-3 py-1.5 md:px-4 md:py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors disabled:opacity-50"
              disabled={isListening || !inputText.trim()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 md:h-5 md:w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 md:gap-4">
            <div className="h-px flex-1 bg-white bg-opacity-30"></div>
            <span className="text-white text-opacity-70 text-xs md:text-sm">
              OR
            </span>
            <div className="h-px flex-1 bg-white bg-opacity-30"></div>
          </div>

          <button
            onClick={handleListen}
            disabled={isListening}
            className="flex items-center justify-center gap-1 md:gap-2 px-3 py-2 md:px-4 md:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:scale-105 active:scale-95 transition-all duration-300 text-sm md:text-base"
          >
            <img
              className="h-5 w-5 md:h-6 md:w-6"
              src={isListening ? "/mic-active.png" : "/mic-norm.png"}
              alt="mic"
            />
            <span>
              {isListening
                ? language === "hindi"
                  ? "सुन रहा हूँ..."
                  : language === "english"
                  ? "Listening..."
                  : language === "hinglish"
                  ? "Sun raha hoon..."
                  : language === "urdu"
                  ? "سن رہا ہوں..."
                  : language === "arabic"
                  ? "أستمع..."
                  : "Listening..."
                : language === "hindi"
                ? "बोलने के लिए टैप करें"
                : language === "english"
                ? "Tap to Speak"
                : language === "hinglish"
                ? "Bolne ke liye tap karo"
                : language === "urdu"
                ? "بولنے کے لیے ٹیپ کریں"
                : language === "arabic"
                ? "انقر للتحدث"
                : "Tap to Speak"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
