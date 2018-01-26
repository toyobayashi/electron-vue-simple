// hello.cc
#include <node.h>

using namespace v8;

void nativeCode(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "I'm from C++ native module."));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "native", nativeCode);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)
