// FoodNLP.swift
import Foundation
import NaturalLanguage

@objc(FoodNLP)
class FoodNLP: NSObject {

  @objc
  func parseFoodItems(_ text: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    var foodItems: [String] = []

    // Tokenize the input text
    let tokenizer = NLTokenizer(unit: .word)
    tokenizer.string = text

    tokenizer.enumerateTokens(in: text.startIndex..<text.endIndex) { tokenRange, _ in
      let word = String(text[tokenRange]).lowercased()
      // Check if the word is in your food items list
      if commonFoodItems.contains(word) {
        foodItems.append(word)
      }
      return true
    }

    resolve(foodItems)
  }
}

// List of common food items
let commonFoodItems: Set<String> = [
  "egg", "eggs", "chicken", "beef", "milk", "tofu", "yogurt", "almonds", "salmon", "tuna", "protein shake"
]
