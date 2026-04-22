function updateDateTime() {
   // =================================================
   // 🕛 Formatting current date & time
   // =================================================
      const now = new Date();

      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = days[now.getDay()];

      const month = now.getMonth() + 1;
      const date = now.getDate();
      const year = now.getFullYear();

      // 12-hour format time
      let hour = now.getHours();
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      if (hour === 0) hour = 12;
      const minute = String(now.getMinutes()).padStart(2, "0");
      const second = String(now.getSeconds()).padStart(2, "0");

   // =================================================
   // ✅ ➊ Display #mainText1: current date & time
   // =================================================
      document.querySelector("#mainText1").textContent = `${dayName}, ${month}/${date}/${year}, ${hour}:${minute}:${second} ${ampm}`;


   // =================================================
   // ✅ ➋ Set your own rules
   // =================================================
      const rules = [
         {
            match: { month: 3, date: 20 },
            text: "Multiple Formats is Tomorrow!",
            image: "./img/MultipleFormats.jpg",
            bgColor: "#ef9dfa"
         },
         {
            match: { month: 3, date: 21 },
            text: "Digital Narrative Exhibition!",
            image: "./img/MultipleFormats.jpg",
            bgColor: "#97dbff"
         },
         {
            match: {}, // 🔡 Default text
            text: "Have a nice day!",
            image: "",
            bgColor: ""
         }
      ];

      // const rules = [
      //    {
      //       match: { day: 5 },
      //       text: "Relax, it's Friday",
      //       image: "",
      //       bgColor: ""
      //    },
      //    {
      //       match: {}, // 🔡 Default text
      //       text: "Have a nice day!",
      //       image: "",
      //       bgColor: ""
      //    }
      // ];

      // const rules = [
      //    {
      //       match: { hourRange: [6, 12] },
      //       text: "Good morning",
      //       image: "",
      //       bgColor: ""
      //    },
      //    {
      //       match: { hourRange: [12, 18] },
      //       text: "Good afternoon",
      //       image: "",
      //       bgColor: ""
      //    },
      //    {
      //       match: {}, // 🔡 Default text
      //       text: "Have a nice day!",
      //       image: "",
      //       bgColor: ""
      //    }
      // ];

   // =================================================
   // ✔️ Function to check if a rule matches
   // =================================================
      function matchRule(rule, now) {
         const m = rule.match;
         if (m.year && m.year !== now.getFullYear()) return false;
         if (m.month && m.month !== (now.getMonth() + 1)) return false;
         if (m.date && m.date !== now.getDate()) return false;
         if (m.day !== undefined && m.day !== now.getDay()) return false;
         if (m.hour !== undefined && m.hour !== now.getHours()) return false;
         if (m.hourRange) {
            const [start, end] = m.hourRange;
            if (!(now.getHours() >= start && now.getHours() < end)) return false;
         }
         return true;
      }

   // =================================================
   // ✔️ Check rules in order and apply the first match
   // =================================================
      for (let rule of rules) {
         if (matchRule(rule, now)) {

            // =================================================
            // ✅ ➌ Display #mainText2 & #image1: based on rules
            // =================================================
               if (rule.text) document.querySelector("#mainText2").textContent = rule.text;
               if (rule.image) document.querySelector("#image1").src = rule.image;
               if (rule.bgColor) document.body.style.backgroundColor = rule.bgColor;
               break;
            // =================================================
         }
      }
   // =================================================
}


// =================================================
// ✔️ Update every second
// =================================================
   updateDateTime();
   setInterval(updateDateTime, 1000);


