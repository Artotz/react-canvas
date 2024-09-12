import { useEffect, useState } from "react";

import { useLocalStorage } from "../../hooks/useLocalStorage";

export default function DatabaseHelper() {
  const [acquiredUpgrades, setAcquiredUpgrades, removeAcquiredUpgrades] =
    useLocalStorage("acquiredUpgrades", undefined);
  const [money, setMoney, removeMoney] = useLocalStorage("money", undefined);

  return (
    <div className="flex flex-col full-size full-center border-solid border-2 border-black">
      <div
        className="flex p-2 px-4 border-solid border-2 border-black hover:border-green-500 bg-green-500 text-black hover:bg-black hover:text-green-500 cursor-pointer select-none"
        onClick={() => {
          setMoney(10000);
        }}
      >
        set money to 10000
      </div>
      <div
        className="flex p-2 px-4 border-solid border-2 border-black hover:border-green-500 bg-green-500 text-black hover:bg-black hover:text-green-500 cursor-pointer select-none"
        onClick={() => {
          let _dbUpgrades = acquiredUpgrades.map(() => 0);

          setAcquiredUpgrades(_dbUpgrades);
        }}
      >
        reset upgrades
      </div>
    </div>
  );
}
