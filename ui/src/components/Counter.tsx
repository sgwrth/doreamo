import { decrement, increment } from "../counter/counterSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";

export function Counter() {
  const count = useAppSelector(state => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <h2>Counter</h2>

      <button aria-label="Increment value" onClick={() => dispatch(increment())}>
        Increment
      </button>

      <span>{count}</span>

      <button aria-label="Decrement value" onClick={() => dispatch(decrement())}>
        Decrement
      </button>
    </>
  )
};