import { ArrowLeft } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const RulesPage = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 relative text-gray-800">
      <ArrowLeft
        className="absolute top-4 size-8 left-4"
        onClick={() => navigate(-1)}
      />
      <h1 className="text-2xl font-bold mb-6 text-center">Rules</h1>

      <p className="mb-4">
        <strong>PLEASE READ OUR RULES BEFORE PLACING BET.</strong> <br />
        ONCE OUR EXCHANGE GIVES USERNAME AND PASSWORD, IT IS YOUR RESPONSIBILITY
        TO CHANGE THE PASSWORD.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1) CHEAT RULES:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            1.1) In Betfair & Fancy markets, If anyone is suspected of using
            ground commentary or courtsiding, the company will void all winning
            bets. This is a zero-tolerance policy.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2) MATCH ODDS RULES:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>2.1) Cricket: We will follow Betfair result.</li>
          <li>2.2) Soccer: We will follow Betfair result.</li>
          <li>2.3) Tennis: We will follow Betfair result.</li>
          <li>
            2.4) IF Any Client Found Hedging Or Manipulating Odds, company has
            the right to Void the Bets.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">
          3) BOOKMAKER MARKET RULES:
        </h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            3.1) Wrong team selection by our mistake will result in the deletion
            of all back and lay bets.
          </li>
          <li>3.2) Wrong rate bets will also be voided.</li>
          <li>
            3.3) If Exchange resettles any bets due to wrong result declaration,
            settlement will be done by the company.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4) FANCY RULES:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            4.1) Advance fancy bets are only valid for full matches (20/50
            Overs).
          </li>
          <li>
            4.2) Advance session bets will be settled 60 mins prior to match
            start.
          </li>
          <li>
            4.3) 3 Wkt or more by bowler in match adv will be settled after full
            match completion.
          </li>
          <li>
            4.4) Under session/fancy bet rules, incomplete bets will be
            canceled, but complete sessions will be settled.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5) IPL RULES:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            5.1) If Over Reduced in Match, we will count Market’s Average
            Scores.
          </li>
          <li>
            5.2) If Match is Abandoned, we will count Market’s Average Scores.
          </li>
          <li>
            5.3) Total Fours, Sixes, Wides, and other fancy bets will be counted
            based on market averages.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6) CASINO RULES:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            6.1) If the company voids any bet due to a technical issue,
            settlement will be done through the agent.
          </li>
          <li>6.2) Maximum bet limits apply per casino provider.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7) COLOR BETS:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>
            7.1) Any market color bets shall be voided and balance confiscated
            if placed with wrong intentions.
          </li>
          <li>
            7.2) The company has full discretion on whether a bet qualifies as a
            color bet.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default RulesPage;
