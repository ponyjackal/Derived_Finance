import StakingListItem from "./StakingListItem";

const StakingList = ({ tokens }) => {
  return (
    <div className="staking-list">
      <div className="staking-header">
        <p className="text-white font-bold text-3xl px-8 py-10">
          Staked LP Tokens
        </p>
        <div className="flex w-full items-center justify-between pb-2 rounded-lg p-3 pr-40 pl-16">
          <p className="text-white">Pool Name</p>
          <p className="text-white">Earned</p>
          <p className="text-white">vAPR</p>
          <p className="text-white">My Deposits</p>
          <p className="text-white">TVL</p>
        </div>
      </div>
      <div className="p-3">
        {tokens &&
          tokens.map((token) => <StakingListItem key={token.id} {...token} />)}
      </div>
    </div>
  );
};

export default StakingList;
