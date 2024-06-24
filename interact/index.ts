import { Command } from "commander";
import { e, envChain, World } from "xsuite";
import data from "./data.json";
require("dotenv").config();

const world = World.new({
  chainId: envChain.id(),
});

const loadWallet = () =>
  world.newWalletFromFile_unsafe("wallet.json", process.env.WALLET_PASSWORD!);

const program = new Command();

program.command("deploy").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.deployContract({
    code: data.code,
    codeMetadata: ["upgradeable", "payable"],
    gasLimit: 100_000_000,
    codeArgs: [
      e.Str(
        "QmU55G8xjM5e8mgGGWF1FgpQWiFiQL9sJceUSfsM37QZSx"
      ) /* image_base_cid */,
      e.Str(
        "QmNVcjbuismE919e8oFjezHP1BMsep6dRW6xBoWap184yn"
      ) /* metadata_base_cid */,
      e.U32(100) /* amount_of_tokens */,
      e.U32(5) /* tokens_limit_per_address */,
      e.U32(2500) /* royalties */,
      e.Tuple(
        e.Str("JEET-dda037") /* token_identifier */,
        e.U64(0) /* token_nonce */,
        e.U(696969 * 10 ** 18) /* amount */
      ) /* selling_price */,
      e.Str(".png") /* image_extension */,
      e.Option(null) /* tags */,
      e.Bool(true) /* is_metadata_in_uris */,
    ],
  });
  console.log("Transaction:", result.tx.explorerUrl);
  console.log("Contract:", result.contract.explorerUrl);
});

program.command("upgrade").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.upgradeContract({
    callee: envChain.select(data.address),
    code: data.code,
    codeMetadata: ["upgradeable"],
    gasLimit: 100_000_000,
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("ClaimDeveloperRewards").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "ClaimDeveloperRewards",
    gasLimit: 10_000_000,
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

// endpoints
program.command("issue_token").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "issueToken",
    gasLimit: 100_000_000,
    value: 0.05 * 10 ** 18,
    funcArgs: [
      e.Str("TheJeeter") /* collection_token_name */,
      e.Str("JEETER") /* collection_token_ticker */,
      e.Bool(false) /* is_not_number_in_name */,
      e.Str("JEET") /* nft_token_name */,
      e.U8(0) /* CanFreeze */,
      e.U8(1) /* CanWipe */,
      e.U8(2) /* CanPause */,
      e.U8(5) /* CanUpgrade */,
      e.U8(6) /* CanAddSpecialRoles */,
    ],
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("set_local_roles").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "setLocalRoles",
    gasLimit: 80_000_000,
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("setNewPrice").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "setNewPrice",
    gasLimit: 20_000_000,
    funcArgs: [
      e.Tuple(
        /* 5 RIDE */
        e.Str("RIDE-05b1bb") /* token_identifier */,
        e.U64(0) /* token_nonce */,
        e.U(5 * 10 ** 18) /* amount */
      ) /* selling_price */,
    ],
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("startMinting").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "startMinting",
    gasLimit: 10_000_000,
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("mint").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "mint",
    gasLimit: 100_000_000,
    esdts: [
      {
        amount: 15 * 10 ** 18,
        id: "RIDE-05b1bb",
        nonce: 0,
      },
    ],
    funcArgs: [e.U32(3)],
  });
  console.log("Transaction:", result.tx.explorerUrl);
});

program.command("giveaway").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.callContract({
    callee: envChain.select(data.address),
    funcName: "giveaway",
    gasLimit: 600_000_000,
    funcArgs: [
      e.List(
        e.Addr("erd1085h6wdckzfkvfftq837mwt2a780dv0p8wcjjpauku7at0dlqswszewvjn")
      ),
      e.U32(1),
    ],
  });

  console.log("Transaction:", result.tx.explorerUrl);
});

// queries

program.command("fetchFileExtension").action(async () => {
  const wallet = await loadWallet();
  const result = await wallet.query({
    callee: envChain.select(data.address),
    funcName: "fileExtension",
  });
  console.log("Result:", result);
});

program.parse(process.argv);
