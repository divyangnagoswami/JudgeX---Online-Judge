/*
  Per-language execution config.

  - image:          Docker image the code runs in.
  - source:         filename the code is written to inside /workspace.
                    (Java MUST be Main.java because the public class is Main.)
  - compile:        shell command to compile, or null for interpreted languages.
  - run:            command that executes the program (stdin is piped in later).
  - timeMultiplier: multiplies the problem's time limit to account for slower
                    startup/runtime of interpreted / JVM languages.
*/
export const languageConfig = {
  cpp: {
    image: "gcc:14",
    source: "main.cpp",
    compile: "g++ /workspace/main.cpp -o /workspace/main",
    run: "/workspace/main",
    timeMultiplier: 1,
  },

  c: {
    image: "gcc:14",
    source: "main.c",
    compile: "gcc /workspace/main.c -o /workspace/main",
    run: "/workspace/main",
    timeMultiplier: 1,
  },

  java: {
    image: "eclipse-temurin:21-jdk",
    source: "Main.java",
    compile: "javac /workspace/Main.java",
    run: "java -cp /workspace Main",
    timeMultiplier: 3,
  },

  python: {
    image: "python:3.12-slim",
    source: "main.py",
    compile: null,
    run: "python3 /workspace/main.py",
    timeMultiplier: 3,
  },

  javascript: {
    image: "node:20-slim",
    source: "main.js",
    compile: null,
    run: "node /workspace/main.js",
    timeMultiplier: 2,
  },
};

export const supportedLanguages = Object.keys(languageConfig);
