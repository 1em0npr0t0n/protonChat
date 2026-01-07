type RangeNumber = {
  min: number;
  max: number;
  [Symbol.iterator](): IterableIterator<number>;
};
type RangeNumber2 = {
  min: number;
  max: number;
  [Symbol.asyncIterator](): AsyncIterableIterator<number>;
};

const range: RangeNumber = {
  min: 0,
  max: 3,
  *[Symbol.iterator]() {
    // 使用Generator函数
    for (let i = this.min; i <= this.max; i++) {
      yield i;
    }
  },
};
const run = () => {
  for (const num of range) {
    console.log(num);
  }
};
run();

//generater
function* generateSequence() {
  yield 1;
  yield 2;
  yield 3;
}
const generater = generateSequence();
console.log(generater.next());
console.log(generater.next());
console.log(generater.next());
console.log(generater.next());

const run2 = () => {
  for (const num of generater) {
    console.log(num);
  }
};
run2();

const asyncRange: RangeNumber2 = {
  min: 0,
  max: 3,
  async *[Symbol.asyncIterator]() {
    // 使用Generator函数
    for (let i = this.min; i <= this.max; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield i;
    }
  },
};

const runAsync = async () => {
  for await (const num of asyncRange) {
    console.log(num);
  }
};

runAsync();
