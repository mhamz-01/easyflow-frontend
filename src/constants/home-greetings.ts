// src/constants/home-greetings.ts
export const homeHeadlines = [
    {
      title: "Where do you want to start?",
      subtitle: "Spin up a doc, sketch on a whiteboard, or knock out a task — pick your move.",
    },
    {
      title: "Let's get something done.",
      subtitle: "One task, one doc, one whiteboard at a time. Small wins add up fast.",
    },
    {
      title: "What's worth your focus today?",
      subtitle: "Pick the thing that matters most and start there.",
    },
    {
      title: "Ready when you are.",
      subtitle: "Drop into a doc, whiteboard, or task — everything's one click away.",
    },
    {
      title: "Today's a good day to ship.",
      subtitle: "Knock out a task, capture an idea, or map it out on a whiteboard.",
    },
    {
      title: "Momentum starts with one click.",
      subtitle: "Pick a doc, a board, or a task — and get moving.",
    },
    {
      title: "What's next on your list?",
      subtitle: "Tasks, docs, and whiteboards — all waiting right here.",
    },
  ];
  
  export const getRandomHeadline = () => {
    const index = Math.floor(Math.random() * homeHeadlines.length);
    return homeHeadlines[index];
  };