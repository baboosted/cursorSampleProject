import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

function Text_03({
    text = "Hover me",
    className = "",
}) {
    // Split text into words first
    const words = text.split(" ");
    
    // Calculate total character count for proper sequential animation
    let totalCharCount = 0;
    const wordsWithCharIndices = words.map(word => {
        const wordStart = totalCharCount;
        totalCharCount += word.length;
        return { word, wordStart };
    });
    
    return (
        <motion.div
            className={cn(
                "w-full text-center inline-flex flex-wrap justify-center transition-all",
                className
            )}
            initial="initial"
            animate="animate"
            whileHover="hover"
        >
            {wordsWithCharIndices.map(({ word, wordStart }, wordIndex) => (
                <div key={wordIndex} className="inline-flex mr-4 last:mr-0">
                    {word.split("").map((char, letterIndex) => {
                        // Global character index across the entire text
                        const globalCharIndex = wordStart + letterIndex;
                        
                        return (
                            <motion.span
                                key={`${wordIndex}-${letterIndex}`}
                                className="inline-block"
                                variants={{
                                    initial: {
                                        y: 0,
                                        opacity: 0,
                                        scale: 0.8,
                                        textShadow: "0px 0px 0px rgba(0,0,0,0)"
                                    },
                                    animate: {
                                        y: 0,
                                        opacity: 1,
                                        scale: 1,
                                        textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 15,
                                            // Use global character index for consistent wave flow
                                            delay: globalCharIndex * 0.04,
                                        },
                                    },
                                    hover: {
                                        y: -5,
                                        scale: 1.05,
                                        textShadow: "0px 8px 15px rgba(0,0,0,0.2)",
                                        transition: {
                                            type: "spring",
                                            stiffness: 500,
                                            damping: 10,
                                            // Also use global character index for hover animation
                                            delay: globalCharIndex * 0.02
                                        }
                                    }
                                }}
                            >
                                {char}
                            </motion.span>
                        );
                    })}
                </div>
            ))}
        </motion.div>
    );
}

export { Text_03 } 