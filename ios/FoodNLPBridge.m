// FoodNLPBridge.m
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(FoodNLP, NSObject)
RCT_EXTERN_METHOD(parseFoodItems:(NSString *)text resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end
