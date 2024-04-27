---
title: Class 类（TS）
date: 2021-08-21T08:04:10+08:00
tags:
  - TypeScript
---

## Class 的基础语法

创建一个最基本的空类

```typescript
class Point {}
```

声明两个公共可写的属性

```typescript
class Point {
  x: number;
  y: number;
}
 
const pt = new Point();
pt.x = 0;
pt.y = 0;
```

字段也可以有初始化值，这些值将在类实例化时自动运行

```typescript
class Point {
  x = 0;
  y = 0;
}

const pt = new Point();
// Prints 0, 0
console.log(`${pt.x}, ${pt.y}`);
```

配置 `strictPropertyInitialization` 控制是否需要在构造函数中初始化类字段。

```typescript
// 坏的写法
class BadGreeter {
  // 报错：属性"name"没有初始化器，也没有在构造函数中明确分配。
  name: string;
}

// 好的写法
class GoodGreeter {
  name: string;
 
  constructor() {
    this.name = "hello";
  }
}
```

如果需要以构造函数外的方式明确字段，可以使用确定赋值断言运算符 `!`

```typescript
class OKGreeter {
  // 这样就可以使该值未初始化，但没有错误
  name!: string;
}
```

字段可以使用 `readonly` 修饰符作为前缀，这样防止对构造函数之外的字段进行赋值。

```typescript
class Greeter {
  readonly name: string = "world";
 
  constructor(otherName?: string) {
    if (otherName !== undefined) {
      this.name = otherName;
    }
  }
 
  err() {
    this.name = "not ok";
    // 无法给“name”分配值，因为它是只读属性。
  }
}
const g = new Greeter();
g.name = "also not ok";
// 无法给“name”分配值，因为它是只读属性。
```

## Constructors

类构造函数与函数非常相似。可以添加带有类型注释、默认值和重载的参数：

```typescript
class Point {
  x: number;
  y: number;
 
  // 具有默认值的普通参数
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}
```

```typescript
class Point {
  // 重载
  constructor(x: number, y: string);
  constructor(s: string);
  constructor(xs: any, y?: any) {
    // ...
  }
}
```

## 类的继承

在 TypeScript 中，如果继承的类在调用 `this` 前没有写 `super()`，会报错提示

```typescript
class Base {
  k = 4;
}
 
class Derived extends Base {
  constructor() {
    // 在 ES5 中打印错误值； 在 ES6 中抛出异常
    console.log(this.k); // 错误：在派生类的构造函数中访问"this"之前必须调用"super"。
    super();
  }
}
```

## Getters / Setters

类也可以使用访问器

```typescript
class C {
  _length = 0;
  get length() {
    return this._length;
  }
  set length(value) {
    this._length = value;
  }
}
```

TypeScript 对访问器有一些特殊的推理规则：

- 如果`get`存在但不存在`set`，则该属性自动`readonly`
- 如果没有指定 setter 参数的类型，则根据 getter 的返回类型推断
- Getter 和 setter 必须具有相同的[成员可见性](https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility)

```typescript
class Thing {
  _size = 0;
 
  get size(): number {
    return this._size;
  }
 
  set size(value: string | number | boolean) {
    let num = Number(value);
 
    // 排除 NaN, Infinity 等
    if (!Number.isFinite(num)) {
      this._size = 0;
      return;
    }
 
    this._size = num;
  }
}
```

## 索引签名

类可以声明索引签名，这个与 `interface` 的索引签名很像

```typescript
class StringArray {
  [s: number]: string | boolean;
}

const a: StringArray = ['hi', true, 'hello']
```

> 因为索引签名类型还需要捕获方法的类型，所以有用地使用这些类型并不容易。通常最好将索引数据存储在另一个地方而不是类实例本身。

## 类的继承

### 类实现接口

实现（implements）是面向对象中的一个重要概念。一般来说，一个类只能继承自另一个类，但是有时候不同类之间可以有一些共同特性，这时就可以把特性提取成接口（interfaces），用 `implements` 关键字来实现。这个特性大大提高了面向对象的灵活性。

举例来说，电视有播放音频功能的功能，可以给电视添加一个播放音频的方法。这时如果另一个类，手机，也有播放音频功能，就可以吧播放音频的功能提取出来作为接口，让电视和手机都去实现它。

```typescript
interface PlayAudio {
  ablePlayAudio(audio: string): void;
}

class Phone implements PlayAudio {
  ablePlayAudio(data: string) {
    console.log('手机播放：' + data)
  }
}

class Teevee implements PlayAudio {
  ablePlayAudio(data: string) {
    console.log('TV 播放：' + data)
  }
}
```

需要注意，`implements` 不会改变 class 内的任何东西，只是对它的实现方式做约定

```typescript
interface A {
  x: number;
  y?: number;
}
class B implements A {
  x = 0;
  z = 2;
}
const c = new B();
console.log(c) // { "x": 0, "z": 2 }
```

### extends 继承

在 TypeScript 中，想要在 `extends` 后覆盖父类的属性或方法，需要与父类的属性或方法类型兼容，如下

错误写法

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name: string) {
    if (name !== undefined) {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
```

正确写法

```typescript
class Base {
  greet() {
    console.log("Hello, world!");
  }
}
 
class Derived extends Base {
  greet(name?: string) {
    if (name !== undefined) {
      console.log(`Hello, ${name.toUpperCase()}`);
    }
  }
}
```

## 属性可见性

### `public`

类成员的默认可见性是 `public`。一个 `public` 成员可以在任何地方进行访问（俗称公共属性，可以在创建后的对象中调用）

```typescript
class Greeter {
  public greet() {
    console.log("hi!");
  }
}
const g = new Greeter();
g.greet();
```

### `protected`

受保护的属性，只能在当前 `class` 和继承它的 `class` 中使用

```typescript
class Greeter {
  public greet() {
    console.log("Hello, " + this.getName());
  }
  protected getName() {
    return "hi";
  }
}
 
class SpecialGreeter extends Greeter {
  public howdy() {
    console.log("Howdy, " + this.getName());
  }
}
const g = new SpecialGreeter();
g.greet();
g.getName(); // 报错，不能访问"protected"的属性
```

但是子类还可以通过重新初始化属性使 `protected` 后的属性重新变的外部可访问

```typescript
class Base {
  protected m = 10;
}
class Derived extends Base {
  // 没有任何修饰，即默认为"public"修饰符
  m = 15;
}
const d = new Derived();
console.log(d.m); // 15
```

跨层次访问 `protected`，假如要在继承的类的函数参数中访问父类的 `protected` 属性，需要通过当前类访问，不能直接通过父类访问

```typescript
class Base {
  protected x: number = 1;
}
class Derived1 extends Base {
  protected x: number = 5;
}
class Derived2 extends Base {
  f1(other: Derived2) {
    other.x = 10;
  }
  f2(other: Base) {
    other.x = 10;
  }
}
```

### `private`

私有属性，与 `protected` 很像，但不允许从子类访问成员

```typescript
class Base {
  private x = 0;
}
const b = new Base();
// 错误：属性“x”是私有的，只能在类“bass”中访问。
console.log(b.x);

class Derived extends Base {
  showX() {
    // 错误：属性“x”是私有的，只能在类“bass”中访问。
    console.log(this.x);
  }
}
```

因为 `private` 成员对子类不可见，所以子类不能增加其可见性：

```typescript
class Base {
  private x = 0;
}
class Derived extends Base {
  // 错误：子类错误的拓展了"x"，属性“x”在类型“Base”中私有
  x = 1;
}
```

TypeScript 允许在同一个类的方法的参数中访问 `private`

```typescript
class A {
  private x = 10;
 
  public sameAs(other: A) {
    // 不会报错
    return other.x === this.x;
  }
}
```

虽然 TypeScript 中的 `protected` 和 `private` 限制了 class 成员的类型，但是由于 JavaScript 的运行时特性，你依然可以通过 `in` 或 `.` 访问该属性，即使会报错，依然能运行。

```typescript
class MySafe {
  protected x = 1;
  private y = 2;
}

const s = new MySafe();
console.log(s.x); // 1
console.log(s.y); // 2
console.log(s["x"]); // 1
```

`private` 还允许在类型检查期间使用括号表示法进行访问，并且不报错

```typescript
class MySafe {
  private p = 3;
}

const s = new MySafe();
console.log(s.p) // 报错：运行结果 3
console.log(s["p"]); // 不报错：运行结果 3
```

与 TypeScripts 的 `private` 不同 JavaScript 的私有字段（`#`）在编译后仍保持私有，并且不提供访问方式，如括号表示法访问，使它们成为**硬私有**。

```typescript
class Dog {
  #barkAmount = 0;
  personality = "happy";

  constructor() {}
}

const a = new Dog()
console.log(a) // { personality: "happy", #barkAmount: 0 }
```

## 静态成员

类可能有 `static` 静态成员。这些成员与类的特定实例无关，不能通过实例化后的对象访问，但它们可以通过类构造函数对象本身访问

```typescript
class MyClass {
  static x = 0;
  static printX() {
    console.log(MyClass.x);
  }
}
console.log(MyClass.x);
MyClass.printX();
```

静态成员也可以使用相同的 `public`，`protected` 和 `private` 可见性修饰符：

```typescript
class MyClass {
  private static x = 0;
}
// 错误：属性“x”是私有的，只能在“MyClass”类中访问。
console.log(MyClass.x);
```

静态成员也可以继承

```typescript
class Base {
  static getGreeting() {
    return "Hello world";
  }
}
class Derived extends Base {
  myGreeting = Derived.getGreeting();
}
```

### 特殊静态名称

由于有些默认的静态属性在 Function 上已经存在，所以没办法在 class 中重新声明来覆盖，如 `name`，`length` 和 `call`

```typescript
class S {
  // 错误：静态属性“名称”与构造函数“S”的内置属性“Function.name”冲突。
  static name = "S!";
}
```

### 静态成员中的类型参数

`static` 泛型类的成员永远不能引用类的类型参数。简单来说就是以下写法在 TypeScript 中不合法

```typescript
class Box<Type> {
  // 错误：静态成员不能引用类类型参数
  static defaultValue: Type;
}
```

> 此处详情参考[静态成员中的类型参数](https://www.typescriptlang.org/docs/handbook/2/classes.html#type-parameters-in-static-members)

## Class 类型声明

类，很像接口，可以是通用的。当使用 实例化泛型类时 `new`，其类型参数的推断方式与函数调用中的方式相同：

```typescript
class Box<Type> {
  contents: Type;
  constructor(value: Type) {
    this.contents = value;
  }
}
// const b: Box<string>
const b = new Box("hello!");
```

## Class 中的 this

JavaScript 的处理 `this` 确实不寻常，通常 `this` 只会跟运行时的上下文有关

```typescript
class MyClass {
  name = "MyClass";
  getName() {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};

// 打印 "obj"
console.log(obj.getName());
```

为了防止这种情况，可以使用箭头函数

```typescript
class MyClass {
  name = "MyClass";
  getName = () => {
    return this.name;
  }
}
const c = new MyClass();
const obj = {
  name: "obj",
  getName: c.getName,
};
 
// 打印 "MyClass"
console.log(obj.getName());
```

还可以在函数声明时强制定义 `this` 的类型，TypeScript 会根据上下文检查你设置的 `this` 类型

```typescript
class MyClass {
  name = "MyClass";
  getName(this: MyClass) {
    return this.name;
  }
}
const c = new MyClass();
// OK
c.getName();
 
const g = c.getName;
// 错误：“void”类型的“this”不能分配给“MyClass”类型的“this”。
console.log(g());
```

### this 参数

在 TypeScript 中强制定义函数的 `this` 参数，在编译后的 JavaScript 文件中会擦除

```typescript
class SomeType {
  a = 1;
  b = 2;
}
// 设置带有 SomeType 类型的 this
function fn(this: SomeType, x: number) {
  /* ... */
}
```

```javascript
// 编译后的 JavaScript
function fn(x) {
  /* ... */
}
```

## this 的类型

TypeScript 中的 `this` 类型判断也是动态的，以以下类为例

```typescript
class Box {
  contents: string = "";
  // TypeScript 推断该方法的类型定义：Box.setValue(value: string): this
  setValue(value: string) {
    this.contents = value;
    return this;
  }
}

const a = new Box()
console.log(a) // { "contents": "" }
a.setValue('hi')
console.log(a) // { "contents": "hi" }
```

然后再创建一个子类

```typescript
class ClearableBox extends Box {
  clear() {
    this.contents = "";
  }
}
 
const a = new ClearableBox();
const b = a.setValue("hello"); // const b: ClearableBox
console.log(b) // { "contents": "hello" }
a.clear()
console.log(b) // { "contents": "" }
```

`this` 也可以当作参数的类型注释使用

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
```

假如有一个类继承了上面的类，那它就必须传入继承后的类

```typescript
class Box {
  content: string = "";
  sameAs(other: this) {
    return other.content === this.content;
  }
}
 
class DerivedBox extends Box {
  otherContent: string = "?";
}
 
const base = new Box();
const derived = new DerivedBox();
// 报错：“Box”类型的参数不能分配给“DerivedBox”类型的参数
derived.sameAs(base);
```

### 基于 this 的类型守卫

在函数的返回值类型定义中使用 `this is Type` 语法，可以缩小在特定条件下 `this` 的类型范围 

```typescript
class FileSystemObject {
  isFile(): this is FileRep {
    return this instanceof FileRep;
  }
  isDirectory(): this is Directory {
    return this instanceof Directory;
  }
  isNetworked(): this is Networked & this {
    return this.networked;
  }
  constructor(public path: string, private networked: boolean) {}
}
 
class FileRep extends FileSystemObject {
  constructor(path: string, public content: string) {
    super(path, false);
  }
}
 
class Directory extends FileSystemObject {
  children: FileSystemObject[];
}
 
interface Networked {
  host: string;
}
 
const fso: FileSystemObject = new FileRep("foo/bar.txt", "foo");
 
if (fso.isFile()) {
  // const fso: FileRep
  fso.content;
} else if (fso.isDirectory()) {
  // const fso: Directory
  fso.children;
} else if (fso.isNetworked()) {
  // const fso: Networked & FileSystemObject
  fso.host;
}
```

基于 `this` 的类型保护的一个常见用例是允许对特定字段进行延迟验证。例如，`undefined` 当 `hasValue` 验证为 `true` 时，这种情况会从保存在 box 内的值中删除一个：

也可以用来指定属性在特殊情况下的类型范围

```typescript
class Box<T> {
  value?: T;
 
  hasValue(): this is { value: T } {
    return this.value !== undefined;
  }
}
 
const box = new Box();
// (property) Box<unknown>.value?: unknown
box.value = "Gameboy";
box.value;
 
if (box.hasValue()) {
  // (property) value: unknown
  box.value;
}
```

上面的代码表示，如果 `hasValue` 为 `true`，那么 value 的类型就是必选值

## 参数属性

TypeScript 提供了一种便捷的写法，可以在 constructor 函数创建时快捷传参并挂载到 `this`，通过添加前缀还能指定参数类型，如`public`，`private`，`protected`，`readonly`

```typescript
class Params {
  constructor(
    public readonly x: number,
    protected y: number,
    private z: number
  ) {
    // No body necessary
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
```

上面的代码相当于在 JavaScript 中运行如下代码

```javascript
"use strict";
class Params {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
const a = new Params(1, 2, 3);
console.log(a.x);
```

## 类表达式

TypeScript 中也支持类表达式声明

```typescript
const someClass = class<Type> {
  content: Type;
  constructor(value: Type) {
    this.content = value;
  }
};
 
const m = new someClass("Hello, world");
```

## 抽象类（`abstract`）

一个类只要有一个属性/方法带有 `abstract` 那么这个类就必须带有 `abstract`，也就是抽象类。抽象类只能作为其他类的继承出现，无法自己作为构造对象，并且抽象类的方法具体实现，需要由它的子类来完成。

```typescript
abstract class Base {
  abstract getName(): string;
 
  printName() {
    console.log("Hello, " + this.getName());
  }
}
// 错误：无法创建抽象类的实例。
const b = new Base();
```

使用继承类实现上面的抽象类

```typescript
class Derived extends Base {
  getName() {
    return "world";
  }
}
 
const d = new Derived();
d.printName(); // "Hello, world" 
```

如果继承的类没有去实现抽象类的方法/属性，会提示报错

```typescript
class Derived extends Base {
  // 错误：非抽象类“Derived”未实现从类“Base”继承的抽象成员“getName”
}
```

抽象类也可以继承抽象类

```typescript
abstract class B {
  abstract markNoice(): void
}

abstract class Animal extends B {
  
}

class Human extends Animal {
  markNoice() {
    console.log('呐呐呐')
  }
}

const jack = new Human()
console.log(jack.markNoice()) // "呐呐呐"
```


## 类之间的关系

在大多数情况下，TypeScript 中的类在结构上进行比较，与其他类型相同。

例如，这两个类可以相互代替，因为它们是相同的：

```typescript
class Point1 {
  x = 0;
  y = 0;
}
 
class Point2 {
  x = 0;
  y = 0;
}
 
// OK
const p: Point1 = new Point2();
```

同样，即使没有显式继承，类之间的子类型关系也存在：

```typescript
class Person {
  name: string;
  age: number;
}
 
class Employee {
  name: string;
  age: number;
  salary: number;
}
 
// OK
const p: Person = new Employee();
```

这听起来很简单，但有些情况似乎比其他情况更奇怪。

空类没有成员。在结构类型系统中，没有成员的类型通常是其他任何类型的超类型。所以如果你写一个空类（永远不要这么做！），任何东西都可以用来代替它：

```typescript
class Empty {}
 
function fn(x: Empty) {
  // can't do anything with 'x', so I won't
}
 
// All OK!
fn(window);
fn({});
fn(fn);
```
